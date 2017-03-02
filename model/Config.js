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
  conact:{type:String,default:''},                            //联系方式
  fax:{type:String,default:''},                              //传真
  copyright:{type:String,default:''},                       //版权信息
  icp:{type:String,default:''} ,                           //备案号
  carousel:{type:Number,default:0},                    //轮播状态
  num:{type:Number,default:4},                            //轮播个数
  isShard:{type:Number,default:0},                    //是否开启分享
  status:{type:Boolean,default:true},                      //关闭站点
});
module.exports = mongoose.model('Config',ConfigSchema);
