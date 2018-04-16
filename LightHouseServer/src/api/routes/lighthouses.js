const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const checkAuth = require('../../middleware/check-auth');

Lighthouse = require('../../orm/models/lighthouse')

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({storage: storage});

router.get('/', function(req, res) {
    Lighthouse.getLighthouses(function(err, lighthouses) {
        if(err) {
            throw err;
        }
        res.json(lighthouses);
    });
});

router.get('/:_id', function(req, res) {
    Lighthouse.getLighthouseById(req.params._id, function(err, lighthouse) {
        if(err) {
            throw err;
        }
        res.json(lighthouse);
    });
});

router.delete('/:_id', checkAuth, function(req, res) {
    Lighthouse.deleteLighthouse(req.params._id, function(err, lighthouse) {
        if(err) {
            throw err;
        }
        res.json('Lighthouse deleted')
    });
});

router.post('/', checkAuth, upload.any(), function(req, res) {
    let users = []
    users.push(req.userData.username)
    const newLighthouse = new Lighthouse({
        settings: req.body.settings,
        texture: req.files[0].path,
        thumbnail: req.files[1].path,
        obj: req.files[2].path,
        creator: req.userData.username
    });
    Lighthouse.createLighthouse(newLighthouse, function(err, lighthouse) {
        if(err) {
            throw err;
        }
        res.json(lighthouse);
    });
});

router.put('/:_id', checkAuth, upload.any(), function(req, res) {
    let id = req.params._id;
    const updatedLighthouse = new Lighthouse({
        settings: req.body.settings,
        texture: req.files[0].path,
        thumbnail: req.files[1].path,
        obj: req.files[2].path,
    });
    Lighthouse.updateLighthouse(id, updatedLighthouse, {}, function(err, lighthouse) {
        if(err) {
            throw err;
        }
        res.json(updatedLighthouse);
    });
});

module.exports = router;