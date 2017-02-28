var mongoose = require('./db.js');
var Schema  = mongoose.Schema;

var AdminSchema = new Schema({
  name:{ type:String,index: true,required: true},
  password:{ type:String,required:true },
  gid:{type:Number,default:-1},
  date:{type:String,default:new Date().getTime()},
  logindate : { type:String},  //最近登录时间
  loginip : { type:String},
  status:{type:Boolean,default:false}
});

module.exports = mongoose.model('Admin',AdminSchema);
