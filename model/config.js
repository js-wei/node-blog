/**
 * @Author: 魏巍
 * @Date:   2017-12-03T12:17:55+08:00
 * @Email:  jswei30@gmail.com
 * @Filename: Config.js
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-03T12:24:07+08:00
 */



var mongoose = require('./db');
//网站配置model
var ConfigSchema = new mongoose.Schema({
  title:{type:String,required:true},
  url:{type:String,default:''},
  keywords:{type:String,default:'',required:true},
  description:{type:String,default:'',required:true},
  logo:{type:String},
  tel:{type:String},
  phone:{type:String},
  email:{type:String},
  address:{type:String},
  flink:{type:Number,default:0},
  is_shard:{type:Number,default:0},
  code:{type:String,deafult:''},                               //统计代码
  shard:{type:String,deafult:''},                             //分享代码
  fax:{type:String,default:''},                              //传真
  copyright:{type:String,default:''},                       //版权信息
  icp:{type:String,default:''} ,                           //备案号
  carousel:{type:Number,default:0},                    //轮播状态
  num:{type:Number,default:4},                            //轮播个数
  isShard:{type:Number,default:0},                    //是否开启分享
  status:{type:Boolean,default:true},                      //关闭站点
},{versionKey:false});
module.exports = mongoose.model('Config',ConfigSchema);
