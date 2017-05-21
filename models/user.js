var mongoose = require('mongoose');

var options = {
    autoIndex: process.env.NODE_ENV !== 'production'
};
var userSchema = mongoose.Schema({
    name : String,
    username :  String,
    password :  String
}, options);

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;