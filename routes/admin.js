var express = require('express'),
router = express.Router(),
mongoose = require('../model/db'),
mongodb=require('../model/mongodb'),
helper = require('../model/helper'),
requestIp = require('request-ip');

/* GET admin listing. */
router.get('/', function(req, res, next) {
    //console.log(requestIp.getClientIp(req),helper.get_client_ip(req));
    res.render('admin/user/login');
});

router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session._name = null;
    req.session._name = null;
    req.session.loginip = null;
    req.session.logindate = null;
    res.redirect("/admin");
});
/**
 * [result 登录]
 * @type {[type]}
 */
router.post('/login_handler',(req, res, next)=>{
    var Admin = require('../model/admin.js');

    var clientIp = requestIp.getClientIp(req);
    if(!req.body.verify){
         res.json({"status":0, "msg":"请输入验证码"});
         return;
    }

    if(req.session.checkcode!=req.body.verify){;
        res.json({"status":0, "msg":"验证码输入错误"});
        return;
    }

    Admin.findOne({'name':req.body.username},(err,result)=>{
        if(err){
            res.json({"status":0, "msg":err});
            return;
        }
        if(result==null){
          req.session.error="请输入正确的账号";
            res.json({"status":0, "msg":"请输入正确的账号"});
            return;
        }
        if(result.password!=helper.password(req.body.password)){
          res.json({"status":0, "msg":"您的密码错误"});
          return;
        }
        if(result.status){
          res.json({"status":0, "msg":"账号已被锁定,请联系一级管理员"});
          return;
        }
        var loginip = helper.get_client_ip(req);
        var logindate = Date.now();
        Admin.update({_id:result._id},{$set:{loginip:loginip,logindate:logindate}},(e,r)=>{
            //记录登录session
            req.session._id = result._id;
            req.session._name = result.name;
            req.session.loginip = result.loginip;
            req.session.logindate = result.logindate;
            res.json({"status":1, "msg":"登录成功",'redirect':'/admin/index'});
            return;
        });
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
        //res.redirect('/admin');
        //res.end(200);
    }
    res.locals.filter={
        key1:{
          tip:'标题',
          feild:null
        },
        key2:{
          tip:'关键词',
          feild:null
        }
    };
    res.locals._name = req.session._name;
    res.locals.url=req.originalUrl;                     //访问地址
    res.locals._id=req.params.id;                       //访问id
    res.locals._p=req.query.p?req.query.p:1;            //访问当前页
    res.locals._url=req._parsedOriginalUrl.pathname;
    res.locals.count=20;                               //table默认显示条数
    var m = req.path.replace(/\//g,'');                //去除基本地址的"/"
    m = m.indexOf('_')>-1? m.split('_')[1]:m;          //得到model
    res.locals.m=m;                                    //判断当前model
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
        'express':mongodb.express,
        'tpl':mongodb.templete.tpl,
        'vtpl':mongodb.templete.version,
        'size':mongodb.size
    };
    var Config = require('../model/config'),
    Comment = require('../model/comment'),
    Colunm = require('../model/colunm');
    Config.findOne({},(e,r)=>{
      if(e){
          res.end(e);
          return;
      }
      Comment.count({see:false},(e1,r1)=>{
        if(e){
            res.end(e);
            return;
        }
        Colunm.count({},(e2,r2)=>{
          if(e){
              res.end(e);
              return;
          }
          res.render('admin/index/index',{os:data,site:r,comm:r1,col:r2});
        });
      });
    });
});
//友情链接
router.get('/link',(req,res)=>{
    res.locals.title=res.locals.title1="友情链接";
    var _params =  helper.map(req);
    var q = _params.param;
    var s = _params.search;
    var search='{'+_params.param+'}';
    search = JSON.parse(search);

    var Link = require('../model/link');
    var page={limit:15,num:1};
    //查看哪页
    let p = req.query.p;
    page['num']=p<1 || p==undefined?1:p;
    var model = {
        order:{date:-1},
        search:search,
        columns:'',
        page:page,
    };
    helper.pagination(model,(err,pageCount,list)=>{
        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']=list.length?pageCount>5?5:pageCount:null;
        return res.render('admin/link/index', {
          list:list,
          page:page,
          search:s
        });
    },req);
});

router.get('/add_link',(req,res)=>{
   res.locals.title=res.locals.title1="添加友情链接";
   var id = req.query.id?req.query.id:0;
   var Link = require('../model/link');

   Link.findOneWithColunms({_id:req.query.id},(e,c,l)=>{
       if(e){
            console.log(e);
       }
       res.render('admin/link/add',{info:c,clist:l});
   });
});

//添加有情链接
router.post('/add_link',(req,res)=>{
    var Link = require('../model/link'),
    data = req.body,
    id = req.body.id;
    delete data['id'];
    if(!id){
        var colunm = new Link(data);
        colunm.save((e,r)=>{
            if(e){
                res.json({'status':0,'msg':'添加失败,请重试'});
                return;
            }
            res.json({'status':1,'msg':'添加成功','redirect':'/admin/link'});
            return;
        });
    }else{
        Link.update({_id:id},{$set:data},(e,r)=>{
          if(e){
              res.json({'status':0,'msg':'修改失败,请重试'});
              return;
          }
          res.json({'status':1,'msg':'修改成功','redirect':'/admin/link'});
          return;
        });
    }
});
//轮播图
router.get('/carousel',(req,res)=>{
    res.locals.title=res.locals.title1="友情链接";
    var _params =  helper.map(req);
    var q = _params.param;
    var s = _params.search;
    var search='{'+_params.param+'}';
    search = JSON.parse(search);

    var Carousel = require('../model/carousel');
    var page={limit:15,num:1};
    //查看哪页
    let p = req.query.p;
    page['num']=p<1 || p==undefined?1:p;
    var model = {
        order:{date:-1},
        search:search,
        columns:'',
        page:page,
        model:Carousel,
    };
    helper.pagination(model,(err,pageCount,list)=>{
        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']=list.length?pageCount>5?5:pageCount:null;
        return res.render('admin/carousel/index', {
          list:list,
          page:page,
          search:s
        });
    });
});

router.get('/add_carousel',(req,res)=>{
   res.locals.title=res.locals.title1="添加轮播图";
   var id = req.query.id?req.query.id:0;
   var Carousel = require('../model/carousel');

   Carousel.findOneWithColunms({_id:req.query.id},(e,c,l)=>{
       if(e){
            console.log(e);
       }
       res.render('admin/carousel/add',{info:c,clist:l});
   });
});

//添加轮播图
router.post('/add_carousel',(req,res)=>{
    var Carousel = require('../model/carousel'),
    data = req.body,
    id = req.body.id;
    delete data['id'];
    if(!id){
        var carousel = new Carousel(data);
        carousel.save((e,r)=>{
            if(e){
                res.json({'status':0,'msg':'添加失败,请重试'});
                return;
            }
            res.json({'status':1,'msg':'添加成功','redirect':'/admin/carousel'});
            return;
        });
    }else{
        Carousel.update({_id:id},{$set:data},(e,r)=>{
          if(e){
              res.json({'status':0,'msg':'修改失败,请重试'});
              return;
          }
          res.json({'status':1,'msg':'修改成功','redirect':'/admin/carousel'});
          return;
        });
    }
});

//评论
router.get('/comment',(req,res)=>{
    res.locals.title=res.locals.title1="评论信息";
    res.locals.filter={
        key1:{
          tip:'标题',
          feild:'title'
        },
        key2:{
          tip:'消息内容',
          feild:"content"
        }
    };

    var _params =  helper.map(req);
    var q = _params.param;
    var s = _params.search;

    let Comment = require('../model/comment'),
    Aricle = require('../model/article');

    var page={limit:15,num:1};
    //查看哪页
    let p = req.query.p;
    page['num']=p<1 || p==undefined?1:p;
    var model = {
        order:{date:-1},
        search:q,
        columns:'',
        page:page,
        populate:'aid'
    };
    helper.pagination(model,(err,pageCount,list)=>{
        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']=list.length?pageCount>5?5:pageCount:null;
        return res.render('admin/comment/index', {
          list:list,
          page:page,
          search:s
        });
    },req);
});
//消息
router.get('/message',(req,res)=>{
      res.locals.title=res.locals.title1="消息信息";
      var _params =  helper.map(req);
      res.locals.filter={
          key1:{
            tip:'标题',
            feild:'title'
          },
          key2:{
            tip:'评论内容',
            feild:"content"
          }
      };
      var q = _params.param;
      var s = _params.search;

      var page={limit:15,num:1};
      //查看哪页
      let p = req.query.p;
      page['num']=p<1 || p==undefined?1:p;
      var model = {
          order:{date:-1},
          search:q,
          columns:'',
          page:page
      };
      helper.pagination(model,(err,pageCount,list)=>{
          page['pageCount']=pageCount;
          page['size']=list.length;
          page['numberOf']=list.length?pageCount>5?5:pageCount:null;
          return res.render('admin/message/index', {
            list:list,
            page:page,
            search:s
          });
      },req);
});

router.get('/add_message',(req,res)=>{
   res.locals.title=res.locals.title1="添加消息";
   var id = req.query.id?req.query.id:0;
   var Message = require('../model/message');

   Message.findOneOrAdd({_id:req.query.id},(e,r)=>{
       if(e)  console.log(e);
       res.render('admin/message/add',{info:r});
   });
});

//添加消息
router.post('/add_message',(req,res)=>{
    var Message = require('../model/message'),
    data = req.body,
    id = req.body.id;
    delete data['id'];
    if(!id){
        var message = new Message(data);
        message.save((e,r)=>{
            if(e){
                res.json({'status':0,'msg':'添加失败,请重试'});
                return;
            }
            res.json({'status':1,'msg':'添加成功','redirect':'/admin/message'});
            return;
        });
    }else{
        Message.update({_id:id},{$set:data},(e,r)=>{
          if(e){
              res.json({'status':0,'msg':'修改失败,请重试'});
              return;
          }
          res.json({'status':1,'msg':'修改成功','redirect':'/admin/message'});
          return;
        });
    }
});

//个人信息
router.get('/profile',(req,res)=>{
    res.locals.title=res.locals.title1="个人信息";
    var Admin = require('../model/admin');
    var id = req.session._id;
    Admin.findOne({_id:id},(e,r)=>{
        if(e) console.log(e);
        res.render('admin/profile/index',{user:r});
    });
});
//修改密码
router.post('/profile',(req,res)=>{
    var Admin = require('../model/admin');
    var id = req.body.id;
    var pwd = req.body.password;
    var pwd1 = req.body.comform_password;
    if(!id){
        res.json({'status':0,'msg':'错误的请求参数'});
        return;
    }
    if(!pwd){
        res.json({'status':0,'msg':'新密码不能为空'});
        return;
    }
    if(!pwd1){
        res.json({'status':0,'msg':'确认密码不能为空'});
        return;
    }
    if(pwd!= pwd1){
        res.json({'status':0,'msg':'两次输入的密码不一致'});
        return;
    }
    pwd = helper.password(pwd);
    Admin.update({_id:id},{$set:{password:pwd}},(e,r)=>{
        if(e)   res.json({'status':0,'msg':'修改失败'});
        req.session._id = null;
        req.session._name = null;
        req.session.loginip = null;
        req.session.logindate = null;
        res.json({'status':1,'msg':'修改成功','redirect':'/admin'});
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

    Colunm.find({},(e,r)=>{
        if(e){
            res.end(e);
            return;
        }
        res.render('admin/colunm/index',{count:r.length,list:helper.sonsTree(r)});
    });
});

//添加栏目
router.get('/add_colunm',(req,res)=>{
   res.locals.title=res.locals.title1="添加栏目";
   var id = req.query.id?req.query.id:0;
   var Colunm = require('../model/colunm');

   Colunm.findOneWithColunms({_id:req.query.id},(e,c,l)=>{
       if(e){
            console.log(e);
       }
       res.render('admin/colunm/add',{info:c,clist:l});
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
router.get('/article',(req,res)=>{
    res.locals.title=res.locals.title1="文章管理";
    var _params =  helper.map(req,{recover:false});
    var q = _params.param;
    var s = _params.search;

    var page={limit:15,num:1};
    var Article = require('../model/article');
    //查看哪页
    let p = req.query.p;
    page['num']=p<1 || p==undefined?1:p;

    var model = {
        order:{date:-1},
        search:q,
        columns:'',
        page:page,
        model:Article,
    };
    helper.pagination(model,(err,pageCount,list)=>{
        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']= list.length?pageCount>5?5:pageCount:null;
        return res.render('admin/article/index', {
          list:list,
          page:page,
          search:s
        });
    });
});

//添加文章
router.get('/add_article',(req,res)=>{
    res.locals.title=res.locals.title1="添加文章";
    var id = req.query._id?req.query._id:0;
    var Article = require('../model/article');
    Article.findOneWithColunms({_id:req.query.id},(e,c,l)=>{
        if(e) console.log(e);
        c.content = helper.decodeHtml(c.content);
        res.render('admin/article/add',{info:c,clist:l});
    },{status:true});
});
//文章添加
router.post('/add_article',(req,res)=>{
    var data = req.body;
    var id= req.body.id?req.body.id:null;
    data.content = helper.escapeHtml(data.content);
    var Article = require('../model/article');
    delete data['_id'];   //删除_id
    if(id==null){
      var article = new Article(data);
      article.save((e,r)=>{
          if(e){
            res.json({'status':0,'msg':'添加失败'});
            return;
          }
          res.json({'status':1,'msg':'添加成功','redirect':'/admin/article'});
          return;
      });
    }else{
      Article.update({_id:id},data,(e,r)=>{
          if(e){
            res.json({'status':0,'msg':'修改失败'});
            return;
          }
          res.json({'status':1,'msg':'修改成功','redirect':'/admin/article'});
          return;
      });
    }
});

router.get('/recover',(req,res)=>{
    res.locals.title=res.locals.title1="回收站";
    var _params =  helper.map(req,{recover:true});
    var q = _params.param;
    var s = _params.search;
    var page={limit:15,num:1};
    var Article = require('../model/article');
    //查看哪页
    let p = req.query.p;
    page['num']=p<1 || p==undefined?1:p;
    var model = {
        order:{rdate:-1},
        search:q,
        columns:'',
        page:page,
        model:Article,
    };
    helper.pagination(model,(err,pageCount,list)=>{
        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']=list.length?pageCount>5?5:pageCount:null;
        return res.render('admin/recover/index', {
          list:list,
          page:page,
          search:s
        });
    });
});

//状态管理
router.all('/status',(req,res)=>{
    var p = req.body,
    fs = require('fs'),
    model = require('../model/'+p.m);

    switch (p.type) {
      case 'receive':
          id = p.id.split(',');
          model.updateAll({_id:{$in:id}},{$set:{recover:true,rdate:Date.now()}},(e,r)=>{
              if(e){
                res.json({'status':0,'msg':'删除失败'});
                return;
              }
              res.json({'status':1,'msg':'删除成功'});
              return;
          });
          break;
      case 'recover':
          id = p.id.split(',');
          model.updateAll({_id:{$in:id}},{$set:{recover:false,rdate:Date.now()}},(e,r)=>{
              if(e){
                res.json({'status':0,'msg':'恢复失败'});
                return;
              }
              res.json({'status':1,'msg':'恢复成功'});
              return;
          });
          break;
      case 'delete'://删除
        model.find({_id:{$in:p.id}},'id image',(e,r)=>{
            if(r.image){
                var path = './public' + r.image;
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
                res.json({'status':1,'msg':'删除成功'});
                return;
            });
        });
        break;
      case 'delete-all':
          model.find({_id:{$in:p.id.split(',')}},'id image status',(e,r)=>{
            for (i in r) {
                if(r[i].image){
                  var path = './public' + r[i].image;
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
