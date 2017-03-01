//图片操作上传
var express = require('express');
var router = express.Router();

var sd = require('silly-datetime');
var multiparty = require('multiparty');   //中间件实现上传
var fs = require('fs');

// var multipartMiddleware = multipart();
router.post('/uploadimg',(req,res)=>{
    var date = sd.format(new Date(), 'YYYYMMDD');
    path = './public/image/'+date+"/";
    //创建文件夹
    fs.exists(path,(exists)=>{
       if(!exists){
          fs.mkdir(path,(err)=>{
            if(err){
              res.send(dstPath);
              return;
            }
          });
       }
    });
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir:path});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
          console.log('parse error: ' + err);
        } else {
          var inputFile = files.image[0];
          var uploadedPath = inputFile.path;
          var dstPath = path + inputFile.originalFilename;
          //重命名为真实文件名
          fs.rename(uploadedPath, dstPath, function(err) {
            if(err){
              console.log('rename error: ' + err);
            } else {
              console.log('rename ok');
            }
          });
        }
        res.send(dstPath.replace('./public',''));
    });
});
//删除图片
router.post('/delmg',(req,res)=>{
    var path = './public/'+req.body.src;
    fs.unlink(path,(err)=>{
      if(err){
          res.json({'status':0,'msg':'图片删除失败'});
          return;
      }
      res.json({'status':1,'msg':'图片删除成功'});
    });
});

module.exports = router;
