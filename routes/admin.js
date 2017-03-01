var express = require('express')
,md5 = require('md5'),
router = express.Router();



/* GET admin listing. */
router.get('/', function(req, res, next) {
    res.render('admin/user/login');
});

router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
});
/**
 * [result 登录]
 * @type {[type]}
 */
router.post('/login_handler',(req, res, next)=>{
    var Admin = require('../model/admin.js')
    req.session.error = "";
    if(!req.body.verify){
         req.session.error="请输入验证码";
         res.json({"status":0, "msg":"请输入验证码"});
    }

    if(req.session.checkcode!=req.body.verify){
        req.session.error="验证码输入错误";
        res.json({"status":0, "msg":"验证码输入错误"});
    }

    Admin.findOne({'name':req.body.username},(err,result)=>{
        if(err){
            req.session.error=err;
            res.json({"status":0, "msg":err});
            return;
        }
        if(result==null){
          req.session.error="请输入正确的账号";
            res.json({"status":0, "msg":"请输入正确的账号"});
            return;
        }
        if(result.password!=req.body.password){
          req.session.error="您的密码错误";
          res.json({"status":0, "msg":"您的密码错误"});
          return;
        }
        if(result.status){
          req.session.error="账号已被锁定,请联系一级管理员";
          res.json({"status":0, "msg":"账号已被锁定,请联系一级管理员"});
          return;
        }
        //记录登录session
        res.session.isLogin = result._id;
        res.session.name = result.name;
        res.session.loginip = result.loginip;
        res.session.logindate = result.logindate;
        res.json({"status":1, "msg":"登录成功"});
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

//使用路由中间件,判断是否登录
router.use(function (req, res, next) {
  if(req.session._name=='' || req.session._name==null){
      res.redirect('/admin');
      res.end(200);
  }
  next();
});
//仪表盘
router.get('/index',(req,res)=>{
  var os=require('os');
  var sd = require('silly-datetime');
  var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  res.locals.title="仪表盘";
  res.locals.title1="仪表盘";
  var data = {
      'endianness':os.endianness(), //字节顺序 高位优先返回BE,低位优先的返回LE
      'freemem':Math.ceil(os.freemem()/1024/1034)+"M",      //闲置内存
      'loadavg':os.loadavg(),      //系统最近5、10、15分钟的平均负载,这是一个针对linux或unix的统计，windows下始终返回[0,0,0]
      'platform':os.platform(),   //操作系统类型,返回值有'darwin', 'freebsd', 'linux', 'sunos' , 'win32'
      'release':os.release(),     //操作系统版本
      'totalmem':Math.ceil(os.totalmem()/1024/1034)+"M",   //系统总内存
      'type':os.type(),           //操作系统名称，基于linux的返回linux,基于苹果的返回Darwin,基于windows的返回Windows_NT
      'uptime': Math.ceil(os.uptime()/3600),
      'node':process.version,
      'time':time
  };
  res.render('admin/index/index',data);
});

//网站配置
router.get('/config',(req,res)=>{
    var Config = require('../model/Config.js');

    // Config.findOne({},(err,data){
    //
    // });
    res.render('admin/config/index');
});










module.exports = router;
