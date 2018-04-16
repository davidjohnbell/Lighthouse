const mongoose = require('mongoose');

let lighthouseSchema = mongoose.Schema({
    settings:{
        type: String
    },
    texture:{
        type: String,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    },
    creator:{
        type: String,
        required: true
    },
    obj:{
        type:String,
        required: true
    },
    create_date:{
        type: Date,
        default: Date.now
    }
});

let Lighthouse = module.exports = mongoose.model('Lighthouse', lighthouseSchema);

module.exports.getLighthouses = function(callback, limit) {
    Lighthouse.find(callback).limit(limit);
}

module.exports.getFavorites = function(favorites, callback, limit) {
    Lighthouse.find({'_id': {'$in': favorites}}, callback).limit(limit);
}

module.exports.getLighthouseById = function(id, callback) {
    Lighthouse.findById(id, callback);
}

module.exports.createLighthouse = function(lighthouse, callback) {
    Lighthouse.create(lighthouse, callback);
}

module.exports.deleteLighthouse = function(id, callback) {
    Lighthouse.findById(id)
    .then(lighthouse => {
        Lighthouse.remove(lighthouse, callback);
    });
}

module.exports.updateLighthouse = function (id, lighthouse, options, callback) {
    let query = {_id: id};
    let update = {
        settings: lighthouse.settings,
        texture: lighthouse.texture,
        thumbnail: lighthouse.thumbnail,
        obj: lighthouse.obj
    }
    Lighthouse.findOneAndUpdate(query, update, options, callback);
}