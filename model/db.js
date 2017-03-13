var config = require('config-lite');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;  
mongoose.connect(config.mongodb);
//失败
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
//第一次打开
mongoose.connection.once('open', function (callback) {});
//链接
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + config.mongodb);
});
//断开
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});
module.exports = mongoose;
