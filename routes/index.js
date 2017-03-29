'use strict'
let express = require('express'),
router = express.Router(),
helper = require('../model/helper');

router.use((req,res,next)=>{
  res.locals._url=req._parsedOriginalUrl.pathname;
  next();
});

router.get('/', function(req, res, next){
  res.render('index');
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
       let m ='<li><a href="https://github.com/js-wei"><i class="fa fa-github"></i></a></li><li><a href="tel:1358486592"><i class="fa fa-phone"></i></a></li>';
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
  let Article = require('../model/article');
  Article.find({status:false},'_id title',(e,r)=>{
       if(e){
         res.json({msg:e});
         return;
       }
       res.json(r);
       return;
  }).sort({date:-1});
})
.get('/article',(req,res)=>{
  let l = parseInt(req.query.limit) || 8;
  let o = (req.query.order=='desc')?-1:1 || -1;
  let Article = require('../model/article');
  Article.find({status:false},'_id title description',(e,r)=>{
       if(e){
         res.json({msg:e});
         return;
       }
       res.json(r);
       return;
  }).sort({date:o}).limit(l);
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
  var model = {
      order:{sorts:1,date:-1},
      search:search,
      columns:'_id title author keywords description hits date ',
      page:page,
      model:Article
  };

  Colunm.findOne({name:id},'_id',(e,r)=>{
      if(e){
         res.josn({msg:e});
         return;
      }
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
  var model = {
      order:{sorts:1,date:-1},
      search:search,
      columns:'_id title author keywords description hits date ',
      page:page,
      model:Article
  };

  Colunm.findOne({name:id},'_id',(e,r)=>{
      if(e){
         res.josn({msg:e});
         return;
      }
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
  var model = {
      order:{sorts:1,date:-1},
      search:search,
      columns:'_id title author keywords description hits date ',
      page:page,
      model:Article
  };

  Colunm.findOne({name:id},'_id',(e,r)=>{
      if(e){
         res.josn({msg:e});
         return;
      }
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
      let title = arc.title.split(' '),
      json='';
      for (var j in title) {
          console.log(title[j]);
          json += `,{"title":"${new RegExp(title[j])}"}`;
      }
      json = `{"fid":"${arc.fid}","$or":[`+json.substring(1);
      json +=`]}`;
      let where = JSON.parse(json);
      console.log(where);
      Article.find(where,(e1,r1)=>{
          console.log(r1);
      }).limit(length);
      res.render('index/article',{a:arc,pre:pre,nex});
    });
})
.get('/round',(req,res)=>{
  let Article = require('../model/article'),
  length = req.params.length || 5;
  Article.getArticleRound(length,(e,r)=>{
      res.json(r);
  });
})
.get('/like',(req,res)=>{
  let Article = require('../model/article'),
  length = req.params.length || 5,
  Colunm =require('../model/colunm');
  Colunm.findOne({_id});
  Article.find({},(e,r)=>{
      res.json(r);
  }).limit(length);
});
module.exports = router;
