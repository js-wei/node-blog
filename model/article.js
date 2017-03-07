var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
    fid:{type:String,default:''},
    author:{type:String,default:'官方发布'},
    title:{type:String,required:[true,'请填写栏目标题']},
    keywords:{type:String,default:''},
    description:{type:String,default:''},
    content:{type:String,default:''},
    image:{type:String,default:''},
    sorts:{type:Number,default:100},
    com:{type:Boolean,default:false},
    new:{type:Boolean,default:false},
    hot:{type:Boolean,default:false},
    head:{type:Boolean,default:false},
    top:{type:Boolean,default:false},
    img:{type:Boolean,default:false},
    hits:{type:Number,default:0},
    status:{type:Boolean,default:false},
    date:{type:String,default:new Date().getTime()}
},{versionKey:false});

ArticleSchema.statics.updateAll=(condition,update,callback)=>{
  mongoose.model('Colunm').updateMany(condition,update,(e,r)=>{
    if(e){
      callback(e,null);
    }else{
      callback(null,r);
    }
  });
};

module.exports = Colunm =  mongoose.model('Article',ArticleSchema);
