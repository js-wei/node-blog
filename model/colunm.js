var mongoose = require('mongoose');

var ColunmSchema = new mongoose.Schema({
    fid:{type:String,default:''},
    title:{type:String,required:[true,'请填写栏目标题']},
    name:{type:String,required:[true,'请填写英文标志']},
    keywords:{type:String,default:''},
    description:{type:String,default:''},
    icon:{type:String,default:''},
    forecolor:{type:String,default:'#ffffff'},
    image:{type:String,default:''},
    type:{type:Number,default:1},    //栏目类型
    position:{type:Number,default:1},
    tpl:{type:String,default:0},
    last:{type:Boolean,default:true},
    sorts:{type:Number,default:100},
    show:{type:Boolean,default:true},
    status:{type:Boolean,default:true},
    date:{type:String,default:new Date().getTime()}
},{versionKey:false});

ColunmSchema.statics.updateAll=(condition,update,callback)=>{
  mongoose.model('Colunm').updateMany(condition,update,(e,r)=>{
    if(e){
      callback(e,null);
    }else{
      callback(null,r);
    }
  });
};

module.exports = Colunm =  mongoose.model('Colunm',ColunmSchema);
