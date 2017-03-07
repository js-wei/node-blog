var express = require('express')
,md5 = require('md5'),
router = express.Router(),
mongoose = require('mongoose'),
mongodb=require('../model/mongodb'),
helper = require('../model/helper');

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
  res.locals.url=req.originalUrl;
  res.locals._id=req.params.id;
  res.locals._p=req.query.p?req.query.p:1;
  res.locals._url=req._parsedOriginalUrl.pathname;
  var m = req.path.replace(/\//g,'');
  if(m.indexOf('_')>-1){
    m = m.split('_')[1];
  }
  res.locals.m=m;
  if(req.session._name=='' || req.session._name==null){
      //res.redirect('/admin');
      //res.end(200);
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
      'uptime': Math.ceil(os.uptime()/3600)+"小时",
      'node':process.version,
      'time':time,
	    'version':mongodb.version,
      'size':mongodb.size
  };
  var Config = require('../model/config');
  Config.findOne({},(e,r)=>{
    if(e){
        res.end(e);
    }
    res.render('admin/index/index',{os:data,site:r});
  });

});

//网站配置
router.get('/config',(req,res)=>{
    var Config = require('../model/config');
    res.locals.title=res.locals.title1="网站配置";
    var id = mongoose.Types.ObjectId('58b81a40e9a8670a6851d35d');
    Config.findOne({},(err,data)=>{
        res.render('admin/config/index',{config:data,_id:id});
    });
});
//修改网站配置
router.post('/config',(req,res)=>{
    var Config = require('../model/config');
    var id = req.body.id;
    var data = req.body;
    delete data["id"];
    var config = new Config(data);    //实例化对象

    if(!id){
      config.save((err,result)=>{
        if(err){
            res.json({'status':0,'msg':"操作失败"});
        }
        res.json({'status':1,'msg':'操作成功','redirect':'/admin/config'});
        return;
      });
    }else{
      delete config['_id'];
      Config.update({_id:id},{$set:data},(err,result)=>{
          if(err){
            res.json({'status':0,'msg':'操作失败'});
            return;
          }
          res.json({'status':1,'msg':'操作成功','redirect':'/admin/config'});
          return;
      });
    }
});
//栏目列表
router.get('/colunm',(req,res)=>{
    res.locals.title=res.locals.title1="栏目管理";
    var Colunm = require('../model/colunm');
    /*
    var search={};
    var page={limit:15,num:1};

    //查看哪页
    if(req.query.p){
        page['num']=req.query.p<1?1:req.query.p;
    }

    var model = {
        search:search,
        columns:'',
        page:page,
        model:Colunm,
    };
    helper.pagination(model,(err,pageCount,list)=>{
        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']=pageCount>5?5:pageCount;
        list = helper.sonsTree(list);
        return res.render('admin/colunm/index', {
          list:list,
          page:page,
          count:20
        });
    });
     */
    Colunm.find({})
    .limit(10)
    .skip(1-1)
    .exec((e,r)=>{
        if(e){
            res.end(e);
            return;
        }
        res.render('admin/colunm/index',{count:r.length,list:helper.sonsTree(r)});
    });
});

//添加栏目
router.get('/add_colunm/:_id',(req,res)=>{
   res.locals.title=res.locals.title1="添加栏目";
   var id = req.params._id?req.params._id:0;
   var Colunm = require('../model/colunm');
   if(id!=0){
       Colunm.findById({_id:req.params._id},(e,r)=>{
          if(e){
              res.end(e);
              return;
          }
          res.locals.info = r;
          res.locals._id = r._id;
       });
   }else{
     res.locals.info = new Colunm();
     res.locals._id = '';
   }
   Colunm.find({},"_id title fid",(e,r1)=>{
       if(e){
           res.end(e);
           return;
       }
       res.render('admin/colunm/add',{clist:helper.sonsTree(r1)});
   });
});
//添加栏目
router.post('/add_colunm',(req,res)=>{
    var Colunm = require('../model/colunm'),
    data = req.body,
    id = req.body.id;
    delete data['id'];
    if(!id){
        var colunm = new Colunm(data);
        colunm.save((e,r)=>{
            if(e){
                res.json({'status':0,'msg':'添加失败,请重试'});
                return;
            }
            res.json({'status':1,'msg':'添加成功','redirect':'/admin/colunm'});
            return;
        });
    }else{
        Colunm.update({_id:id},{$set:data},(e,r)=>{
          if(e){
              res.json({'status':0,'msg':'修改失败,请重试'});
              return;
          }
          res.json({'status':1,'msg':'修改成功','redirect':'/admin/colunm'});
          return;
        });
    }
});
//文章管理
router.get('/list',(req,res)=>{
    res.locals.title=res.locals.title1="文章管理";
    res.render('admin/article/index');
});

//添加文章
router.get('/add_article',(req,res)=>{
    res.locals.title=res.locals.title1="添加文章";
    var id = req.query._id?req.query._id:0;
    var Article = require('../model/article'),
    Colunm = require('../model/colunm');
    if(id!=0){
        Article.findById({_id:req.query._id},(e,r)=>{
           if(e){
               res.end(e);
               return;
           }
           res.locals.info = r;
           res.locals._id = r._id;
        });
    }else{
      res.locals.info = new Article();
      res.locals._id = '';
    }
    Colunm.find({},"_id title fid",(e,r1)=>{
        if(e){
            res.end(e);
            return;
        }
        console.log(r1);
        res.render('admin/colunm/add',{clist:helper.sonsTree(r1)});
    });
});



//状态管理
router.all('/status',(req,res)=>{
    var p = req.body,
    fs = require('fs'),
    model = require('../model/'+p.m);
    switch (p.type) {
      case 'delete'://删除
        model.find({_id:{$in:p.id}},'id image',(e,r)=>{
            if(r.image!=undefined){
                var path = './public' + r.icon;
                fs.unlink(path,(e)=>{
                    if(e){
                        res.json({'status':0,'msg':'删除图片失败'});
                        return;
                    }
                });
            }
            model.remove({_id:p.id},(e,r)=>{
                if(e){
                    res.json({'status':0,'msg':'删除失败'});
                    return;
                }
                res.json({'status':0,'msg':'删除成功'});
                return;
            });
        });
        break;
      case 'delete-all':
          model.find({_id:{$in:p.id.split(',')}},'id image status',(e,r)=>{
            for (i in r) {
                if(r[i].image!=''){
                  var path = './public' + r.icon;
                  fs.unlink(path,(e)=>{
                      if(e){
                        res.json({'status':0,'msg':'删除图片失败'});
                        return;
                      }
                  });
                }
            }
          });
          model.remove({_id:{$in:p.id.split(',')}},(e,r)=>{
              if(e){
                  res.json({'status':0,'msg':'删除失败'});
                  return;
              }
              res.json({'status':1,'msg':'删除成功'});
              return;
          });
        break;
      case 'enable'://启用
        id = p.id.split(',');
        model.updateAll({_id:{$in:id}},{$set:{status:true}},(e,r)=>{
            if(e){
              res.json({'status':0,'msg':'启用失败'});
              return;
            }
            res.json({'status':1,'msg':'启用成功'});
            return;
        });
        break;
      case 'forbidden'://禁用
        id = p.id.split(',');
        model.updateAll({_id:{$in:id}},{$set:{status:false}},(e,r)=>{
            if(e){
              res.json({'status':0,'msg':'禁用失败'});
              return;
            }
            res.json({'status':1,'msg':'禁用成功'});
            return;
        });
        break;
    }
});

module.exports = router;
