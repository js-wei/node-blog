var mongoose = require('./db'),
helper = require('../model/helper'),
Colunm = require('../model/colunm');
var Schema  = mongoose.Schema;

var CarouselSchema = new Schema({
  fid:{type:String,default:''},
  title:{ type:String,index: true,required:[true,'请输入标题']},
  url:{type:String,default:''},
  image:{type:String,default:'',required:[true,'请输入没有上传图片']},
  description:{ type:String,default:''},
  position:{type:Number,default:0},
  sorts:{type:Number,default:100},
  status:{type:Boolean,default:true},
  date:{type:String,default:Date.now()}
},{versionKey:false});

CarouselSchema.statics.updateAll=(condition,update,callback)=>{
  mongoose.model('Link').updateMany(condition,update,(e,r)=>{
    if(e){
      callback(e,null);
    }else{
      callback(null,r);
    }
  });
};

CarouselSchema.statics.findOneWithColunms=(condition,callback)=>{
   if(condition._id==0 || condition._id==null){
      mongoose.model('Colunm').find({},"_id title fid",(e,r1)=>{
          if(e)  callback(e,null,null);
          var model = new Carousel();
          model._id=null;
          callback(null,model,helper.sonsTree(r1));
      });
   }else{
     mongoose.model('Carousel').findOne(condition,(e,r)=>{
         if(e){
           callback(e,null,null);
         }else{
           if(r){
             mongoose.model('Colunm').find({},"_id title fid",(e,r1)=>{
                 if(e)  callback(e,null,null);
                 callback(null,r,helper.sonsTree(r1));
             });
           }
         }
     });
   }
}

module.exports = Carousel = mongoose.model('Carousel',CarouselSchema);
