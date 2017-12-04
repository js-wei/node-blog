/**
 * @Author: 魏巍
 * @Date:   2017-12-03T12:17:55+08:00
 * @Email:  jswei30@gmail.com
 * @Filename: comment.js
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-03T12:24:04+08:00
 */



var mongoose = require('./db');
var Schema  = mongoose.Schema;

var CommentSchema = new Schema({
  fid:{type:String,default:''},
  aid:{type:mongoose.Schema.Types.ObjectId,ref:'Article'},
  title:{ type:String,index: true,required:[true,'请输入标题']},
  image:{type:String,default:''},
  content:{type:String,default:''},
  send_ip:{type:String,default:''},
  see:{type:Boolean,default:false},
  status:{type:Boolean,default:true},
  date:{type:String,default:Date.now()}
},{versionKey:false});

CommentSchema.statics.updateAll=(condition,update,callback)=>{
    mongoose.model('Comment').updateMany(condition,update,(e,r)=>{
      if(e){
        callback(e,null);
      }else{
        callback(null,r);
      }
    });
};

CommentSchema.statics.findArticleNameByCommentId=(condition,populate,callback)=>{
    populate = populate||'';
    mongoose.model('Comment').find(condition).populate(populate).exec((e,r)=>{
      if(e){
        callback(e,null);
      }else{
        callback(null,r);
      }
    });
}


module.exports = Comment = mongoose.model('Comment',CommentSchema);
