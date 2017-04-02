'use strict'
let express = require('express'),
router = express.Router(),
helper = require('../model/helper');

router.use((req,res,next)=>{
  res.locals._url=req._parsedOriginalUrl.pathname;
  res.locals._site=helper._site;
  res.locals._title=null;
  next();
});
router.get('/', function(req, res, next){
  let l = parseInt(req.query.limit) || 12;
  let o = (req.query.order=='desc')?1:-1 || -1;
  let Article = require('../model/article');
  Article.find({status:false,recover:false},'_id title description content',(e,r)=>{
       if(e){
         res.send(404);
         return;
       }
       for (var i = 0; i < r.length; i++) {
         let html = helper.decodeHtml(r[i].content);
         html = helper.delHtmlTag(html).substring(0,150);
         r[i].content = html;
       }
       res.render('index',{arc:r});
  }).sort({_id:o}).limit(l);
})
.get('/colunm',(req, res)=>{
  let Colunm = require('../model/colunm'),
  $ = require('jquery')(require("jsdom").jsdom().defaultView);
  Colunm.find({status:true},'_id title name date fid',(e,r)=>{
       if(e){
         res.json({msg:e});
         return;
       }
       let html='<ul class="nav navbar-nav navbar-right main-nav"></ul>';
       $('body').append(html);
       $.each(r,function(k,v) {
          if(v.fid==''){
            let item =`<li id="comment${v._id}"><a href="/category/${v.name}" data-toggle="dropdown" data-hover="dropdown" aria-expanded="false">${v.title}</a></li>`;
						$(".main-nav").append(item);
					}else{
						if($("#comment"+v.fid).find(".comments").length==0){
                let div=`<ul class="dropdown-menu"><li id="comment${v._id}" class="comments"><a href="/category/${v.name}" data-toggle="dropdown" data-hover="dropdown" aria-expanded="false">${v.title}</a></li></ul>`;
                $(`li#comment${v.fid}`).append(div);
            }else{
                let item =`<li class="comments" id="comment${v._id}"><a href="/category/${v.name}" data-toggle="dropdown" data-hover="dropdown" aria-expanded="false">${v.title}</a></li>`;
  							$(`#comment${v.fid} ul`).append(item);
						}
					}
       });
       let m ='<li><a href="https://github.com/js-wei" title="访问我的github"><i class="fa fa-github"></i></a></li><li><a href="tel:1358486592" title="使用Skype联系我"><i class="fa fa-phone"></i></a></li>';
       $(".main-nav").append(m);
      $('a[data-toggle="dropdown"]').each(function(){
          if(!$(this).siblings('ul.dropdown-menu').length){
              $(this).removeAttr('data-toggle').removeAttr('data-hover').removeAttr('aria-expanded');
          }
      });

      let _nav = $('body').html();
      res.json(_nav);
      return;
  });
})
.get('/marquee',(req,res)=>{
  let Article = require('../model/article'),
  length = req.query.length || 10;
  Article.find({status:false},'_id title',(e,r)=>{
     if(e){
       res.json({msg:e});
       return;
     }
     res.json(r);
  }).sort({_id:-1}).limit(length);
})
.get('/article',(req,res)=>{
  let l = parseInt(req.query.limit) || 12;
  let Article = require('../model/article');
  Article.find({status:false,recover:false},'_id title description content',(e,r)=>{
       if(e){
         res.json({msg:e});
         return;
       }
       for (var i = 0; i < r.length; i++) {
         let html = helper.decodeHtml(r[i].content);
         html = helper.delHtmlTag(html).substring(0,150);
         r[i].content = html;
         //r[i].content = helper.delHtmlTag(helper.decodeHtml(r[i].content));
       }
       res.json(r);
       return;
  }).sort({_id:-1}).limit(l);
})
.get('/category',(req,res)=>{
  let id = req.query.id || 'html',
  p = req.query.p,
  Colunm = require('../model/colunm'),
  Article = require('../model/article'),
  path = require('path'),
  page=[];
  let url = req._parsedOriginalUrl.pathname;
  res.locals._url =  url+"/"+id;
  var _params =  helper.map(req);
  var q = _params.param;
  var s = _params.search;
  var search='{'+_params.param+'}';
  search = JSON.parse(search);
  //查看哪页
  page['num']=p<1 || p==undefined?1:p;

  Colunm.findOne({name:id},'_id',(e,r)=>{
      if(e){
         res.josn({msg:e});
         return;
      }
      var model = {
          order:{sorts:1,date:-1},
          search:{fid:r._id,status:false,recover:false},
          columns:'_id title author keywords description hits date ',
          page:page,
          model:Article
      };

      helper.pagination(model,(err,pageCount,list)=>{
          page['pageCount']=pageCount;
          page['size']=list.length;
          page['numberOf']=list.length?pageCount>5?5:pageCount:null;
          return res.render('index/list', {
            list:list,
            page:page,
            search:s,
            id:id
          });
      });
  });
})
.get('/category/:id/:p',(req,res)=>{
  let id = req.params.id || 'html',
  p = req.params.p,
  Colunm = require('../model/colunm'),
  Article = require('../model/article'),
  path = require('path'),
  page=[];
  let url = req._parsedOriginalUrl.pathname;
  res.locals._url =  path.dirname(url);
  var _params =  helper.map(req);
  var q = _params.param;
  var s = _params.search;
  var search='{'+_params.param+'}';
  search = JSON.parse(search);
  //查看哪页
  page['num']=p<1?1:p;

  Colunm.findOne({name:id},'_id',(e,r)=>{
      if(e){
         res.josn({msg:e});
         return;
      }
      var model = {
          order:{sorts:1,date:-1},
          search:{fid:r._id,status:false,recover:false},
          columns:'_id title author keywords description hits date ',
          page:page,
          model:Article
      };
      helper.pagination(model,(err,pageCount,list)=>{
          page['pageCount']=pageCount;
          page['size']=list.length;
          page['numberOf']=list.length?pageCount>5?5:pageCount:null;
          return res.render('index/list', {
            list:list,
            page:page,
            search:s,
            id:id
          });
      });
  });
})
.get('/category/:id',(req,res)=>{
  let id = req.params.id || 'html',
  p = req.params.p,
  Colunm = require('../model/colunm'),
  Article = require('../model/article'),
  path = require('path'),
  page=[];
  let url = req._parsedOriginalUrl.pathname;
  res.locals._url =  url;
  var _params =  helper.map(req);
  var q = _params.param;
  var s = _params.search;
  var search='{'+_params.param+'}';
  search = JSON.parse(search);
  //查看哪页
  page['num']=p<1||p==undefined?1:p;

  Colunm.findOne({name:id},'_id',(e,r)=>{
      if(e){
         res.josn({msg:e});
         return;
      }
      var model = {
          order:{sorts:1,date:-1},
          search:{fid:r._id,status:false,recover:false},
          columns:'_id title author keywords description hits date ',
          page:page,
          model:Article
      };
      helper.pagination(model,(err,pageCount,list)=>{
          page['pageCount']=pageCount;
          page['size']=list.length;
          page['numberOf']=list.length?pageCount>5?5:pageCount:null;
          return res.render('index/list', {
            list:list,
            page:page,
            search:s,
            id:id
          });
      });
  });
})
.get('/topic/:id',(req,res)=>{
    let Article = require('../model/article'),
    id = req.params.id,
    Colunm =require('../model/colunm'),
    length = req.params.length || 5;
    Article.getArticleSee({_id:id},(e,arc,pre,nex)=>{
      res.locals._title = arc.title;
      let title = arc.title.split(' '),
      json='';
      for (var j in title) {
          json += `,{"title":${new RegExp(title[j])}}`;
      }
      json = `{"$or":[`+json.substring(1);
      json +=`]}`;
      let where = eval('(' + json + ')');
      req.session._fid=arc.fid;
      Article.find(where,'_id title',(e1,r1)=>{
        res.render('index/article',{a:arc,pre:pre,nex,com:r1});
      }).limit(length).sort({_id:-1});
    });
})
.get('/round',(req,res)=>{
  let Article = require('../model/article'),
  length = req.query.length || 5,
  _fid = req.session._fid;
  Article.getArticleRound({fid:_fid,status:false,recover:false},length,(e,r)=>{
      if(e) res.json(e);
      res.json(r);
  });
})
.get('/com',(req,res)=>{
  let Article = require('../model/article'),
  length = req.query.length || 5,
  Colunm =require('../model/colunm'),
  _fid = req.session._fid;
  Article.getArticleRound({fid:_fid,status:false,recover:false},5,(e,r)=>{
      res.json(r);
  });
});
module.exports = router;
