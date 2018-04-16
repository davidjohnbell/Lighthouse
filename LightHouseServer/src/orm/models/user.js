const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    favorites:{
        type: [String]
    },
    create_date:{
        type: Date,
        default: Date.now
    }
});

let User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMatch) {
        callback(null, isMatch);
    })
}

module.exports.createUser = function(user, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            User.create(user, callback);
        })
    })
}

module.exports.deleteUser = function(id, callback) {
    User.findById(id)
    .then(user => {
        User.remove(user, callback);
    });
}

module.exports.addFavorite = function(lighthouseId, userId, options, callback) {
    let query = {_id: userId};
        let update = {
             $push: { favorites: lighthouseId }
        }
        User.findOneAndUpdate(query, update, options, callback);
}

module.exports.removeFavorite = function(lighthouseId, userId, options, callback) {
    let query = {_id: userId};
        let update = {
             $pull: { favorites: lighthouseId }
        }
        User.findOneAndUpdate(query, update, options, callback);
}
