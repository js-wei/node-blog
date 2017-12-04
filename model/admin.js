/**
 * @Author: 魏巍
 * @Date:   2017-12-03T12:17:55+08:00
 * @Email:  jswei30@gmail.com
 * @Filename: admin.js
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-03T12:23:49+08:00
 */



var mongoose = require('./db.js');
var Schema  = mongoose.Schema;

var AdminSchema = new Schema({
  name:{ type:String,index: true,required:[true,'请填写账号']},
  password:{ type:String,required:[true,'请填写密码'] },
  gid:{type:Number,default:-1},
  date:{type:String,default:Date.now()},
  logindate : { type:String},  //最近登录时间
  loginip : { type:String},
  status:{type:Boolean,default:false}
},{versionKey:false});

module.exports = mongoose.model('Admin',AdminSchema);
