var mongoose = require('./db'),
Colunm = require('../model/colunm'),
helper = require('../model/helper');

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
    recover:{type:Boolean,default:false},
    rdate:{type:String,default:Date.now()},
    date:{type:String,default:Date.now()}
},{versionKey:false});

ArticleSchema.statics.updateAll=(condition,update,callback)=>{
  mongoose.model('Article').updateMany(condition,update,(e,r)=>{
    if(e){
      callback(e,null);
    }else{
      callback(null,r);
    }
  });
};

ArticleSchema.statics.findOneWithColunms=(condition,callback,condition1)=>{
   if(condition._id==0){
      mongoose.model('Colunm').find(condition1,"_id title fid",(e,r1)=>{
          if(e)  callback(e,null,null);
          var model = new Article();
          model._id=null;
          callback(null,model,helper.sonsTree(r1));
      });
   }else{
     mongoose.model('Article').findOne(condition,(e,r)=>{
         if(e){
           callback(e,null,null);
         }else{
           if(r){
             mongoose.model('Colunm').find(condition1,"_id title fid",(e,r1)=>{
                 if(e)  callback(e,null,null);
                 callback(null,r,helper.sonsTree(r1));
             });
           }
         }
     });
   }
}

module.exports = Article =  mongoose.model('Article',ArticleSchema);
