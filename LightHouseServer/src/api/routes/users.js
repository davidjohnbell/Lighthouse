const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkAuth = require('../../middleware/check-auth');

User = require('../../orm/models/user');
Lighthouse = require('../../orm/models/lighthouse')

router.get('/:_id', function(req, res) {
    User.getUserById(req.params._id, function(err, user) {
        if(err) {
            throw err;
        }
        let safeUser = {
            username: user.username,
            create_date: user.create_date,
            _id: user._id
        }
        let userStr = JSON.stringify(safeUser);
        res.json(userStr);
    });
});

router.get('/', checkAuth, function(req, res) {
    User.findOne({username: req.userData.username})
    .then(user => {
        let favorites = user.favorites;
        Lighthouse.getFavorites(favorites, function(err, lighthouses) {
            if(err) {
                throw err;
            }
            res.json(lighthouses)
        })
    })
})

router.delete('/:_id', checkAuth, function(req, res) {
    User.deleteUser(req.params._id, function(err, user) {
        if(err) {
            throw err;
        }
        res.json('User deleted')
    });
});

router.post('/register', function(req, res) {
    User.findOne({username: req.body.username})
    .exec()
    .then(user => {
        if (user) {
            return res.status(409).json({
                message: 'username already exists'
            })
        } else {
            let newUser = req.body;
            User.createUser(newUser, function(err, user) {
                if(err) {
                    throw err;
                }
                res.json(user);
            });
        }
    })
});

router.post('/login', function(req, res) {
    User.findOne({username: req.body.username})
    .exec()
    .then(user => {
        if(!user) {
            return res.status(401).json({
                message: 'auth failed'
            });
        }
        User.comparePassword(req.body.password, user.password, function(err, isMatch) {
            if(err) {
                return res.status(401).json({
                    message: 'auth failed'
                });
            }
            if(isMatch) {
                const token = jwt.sign(
                    {
                        username: user.username,
                        userId: user._id 
                    }, 
                    'secret', 
                    {
                        expiresIn: "1d"
                    }
                )
                return res.status(200).json({
                    message: 'auth successful',
                    token: token
                })
            }
            res.status(401).json({
                message: 'auth failed'
            });
        })
    })
});

router.put('/favorites/:lighthouseId', checkAuth, function(req, res) {
    let userId = req.userData.userId;
    let lighthouseId = req.params.lighthouseId
    User.findOne({username: req.userData.username})
    .then(user => {
        let favorites = user.favorites;
        console.log(favorites)
        let found = favorites.find(function(element) {
            return element === lighthouseId;
        })
        if(found) {
            User.removeFavorite(req.params.lighthouseId, userId, {}, function(err, user) {
                if(err) {
                    throw err;
                }
                res.json(user)
            })
        } else {
            User.addFavorite(req.params.lighthouseId, userId, {}, function(err, user) {
                if(err) {
                    throw err;
                }
                res.json(user)
            })
        }
    }) 
});

module.exports = router;