var express = require('express')
,md5 = require('md5'),
router = express.Router(),
Admin = require('../model/admin.js');

/* GET admin listing. */
router.get('/', function(req, res, next) {
    res.render('admin/user/login',{title:'admin'});
});

router.post('/login_handler',(req, res, next)=>{
    if(!req.body.verify){
         res.json({"status":0, "msg":"请输入验证码"});
    }

    if(req.session.checkcode!=req.body.verify){
        res.json({"status":0, "msg":"验证码输入错误"});
    }

    Admin.findOne({'name':req.body.username},(err,result)=>{
        if(err){
            res.json({"status":0, "msg":err});
            return;
        }
        if(result==null){
            res.json({"status":0, "msg":"请输入正确的账号"});
            return;
        }
        res.json({"status":1, "msg":"登录成功"});
        console.log(result);
    });
});


router.get('/png',function(req,res,next){
  var pnglib = require('pnglib'),
  code='',
  random,
  length=4;
  var p = new pnglib(100,30,8);

  random = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
     'S','T','U','V','W','X','Y','Z'];//随机数

  for(var i = 0; i < length; i++) {//循环操作
        var index = Math.floor(Math.random()*35);//取得随机数的索引（0~35）
        //code += random[index];//根据索引取得随机数加到code上
        //var lineIndex = p.index(this.widthAverage * numSection + random_x_offs,i+random_y_offs);
  }
  res.send(code);
});

/**
 * 生成验证码
 * @type {[type]}
 */
router.get('/captcha',function(req,res,next){
  var captchapng = require('captchapng');
  var width=!isNaN(parseInt(req.query.width))?parseInt(req.query.width):80;
  var height=!isNaN(parseInt(req.query.height))?parseInt(req.query.height):30;
  var length=!isNaN(parseInt(req.query.length))?parseInt(req.query.length):4;

  var code = parseInt(Math.random()*9000+1000);
  req.session.checkcode = code;

  var p = new captchapng(width,height, code);
  p.color(0, 0, 0, 0);
  p.color(205,85,85, 255);

  var img = p.getBase64();
  var imgbase64 = new Buffer(img,'base64');
  res.writeHead(200, {
      'Content-Type': 'image/png'
  });
  res.end(imgbase64);
});

module.exports = router;
