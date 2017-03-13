var  mongoose = require('./db.js');

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    title:{type:String,default:''},
    content:{type:String,default:''},
    date:{type:String,default:Date.now()},
    status:{type:Boolean,default:true}
});


module.exports = Message = mongoose.model('Message',MessageSchema);
