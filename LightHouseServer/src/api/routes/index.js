const express = require('express');
const router = express.Router();

router.get('/', ensureAuthenticated, function(req, res, next) {
    res.send('LightHouse main page');
});

//access control/page protection
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;