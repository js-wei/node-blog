//图片操作上传
var express = require('express'),
router = express.Router(),
path = require('path'),
sd = require('silly-datetime'),
multiparty = require('multiparty'),
fs = require('fs');

router.post('/upload', function(req, res) {
    var date = sd.format(new Date(), 'YYYYMMDD');
    path = './public/editor/'+date+"/";
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
          var inputFile = files.upload_file;
          var uploadedPath = inputFile.path;
          var dstPath = path + inputFile.originalFilename;
          //重命名为真实文件名
          fs.rename(uploadedPath, dstPath, function(err) {
              if(err){
                    console.log('rename error: ' + err);
               } else {
                    res.send({
                        success: true,
                        file_path: dstPath.replace('./public','')
                    });
              }
          });
        }
    });
});

router.post('/upload_archiver',(req,res)=>{
    var date = sd.format(new Date(), 'YYYYMMDD');
    path = './public/archiver/'+date+"/";
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
