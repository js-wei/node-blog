var mongoose = require('./db.js');
var Schema  = mongoose.Schema;
var AdminSchema = new Schema({
  name:{ type:String,index: true,require:true},
  password:{ type:String,require:true },
  date:{type:String,default:new Date().getTime()},
  logindate : { type:String},  //最近登录时间
  loginip : { type:String},
  status:{type:Boolean,default:false}
});
module.exports = mongoose.model('Admin',AdminSchema);
