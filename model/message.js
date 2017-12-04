/**
 * @Author: 魏巍
 * @Date:   2017-12-03T12:17:55+08:00
 * @Email:  jswei30@gmail.com
 * @Filename: message.js
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-03T12:24:22+08:00
 */



var  mongoose = require('./db.js');

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    title:{type:String,default:''},
    content:{type:String,default:''},
    date:{type:String,default:Date.now()},
    status:{type:Boolean,default:true}
});
//查找添加
MessageSchema.statics.findOneOrAdd=(condition,callback)=>{
    if(condition._id==0 || condition._id==null){
         var model = new Message();
         model._id=null;
         callback(null,model);
    }else {
         mongoose.model('Message').findOne(condition,(e,r1)=>{
            if(e)  callback(e,null);
            callback(null,r1);
         });
    }
};
module.exports = Message = mongoose.model('Message',MessageSchema);
