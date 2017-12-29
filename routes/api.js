/**
 * @Author: 魏巍
 * @Date:   2017-12-27T17:42:31+08:00
 * @Email:  524314430@qq.com
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-29T22:27:52+08:00
 */
var express = require('express');
var router = express.Router(),
  helper = require('../model/helper');

router.get('/', (req, res) => {
  res.send('This is api controller!');
}).
get('/colunm', (req, res) => {
  let Colunm = require('../model/colunm'),
    $ = require('jquery')(require("jsdom").jsdom().defaultView),
    params = req.query;
  Colunm.find({
    status: true
  }, '_id title name  fid', (e, r) => {
    if (e) {
      res.json({
        msg: e
      });
      return;
    }
    if(!r){
      res.json({status:0,msg:'没有查询到数据'});
    }
    let html = `<ul class="navbar-nav mr-auto">
    <li><a href="/" class="nav-link">首页</a></li>
</ul>`;
    $('body').append(html);
    $.each(r, function(k, v) {
      if (v.fid == '') {
        let html = `
  <li class="nav-item comment${v._id}">
    <a  href="/${params.redirect}/${v.name}" class="nav-link">${v.title}</a>
   </li>
`;
        $(".navbar-nav").append(html);
      } else {
        if ($(".comment" + v.fid).find(".dropdown-menu").length == 0) {
          let tpl = ` <div class="dropdown-menu dropdown-menu-left comment${v._id}" aria-labelledby="navbarDropdown_${v._id}">
    <a href="/${params.redirect}/${v.name}" class="dropdown-item">${v.title}</a>\n</div>
  </li>`;
          $(`li.comment${v.fid}`).append(tpl);
          $(`li.comment${v.fid}`).addClass('dropdown');
          $(`li.comment${v.fid}`).attr('id',`navbarDropdown_${v._id}`);
        } else {
          let a = `    <a href="/${params.redirect}/${v.name}" class="dropdown-item">${v.title}</a>\n`;
          $(`.comment${v.fid} div`).append(a);
        }
      }
    });
    $(`li.dropdown`).children('a').addClass('dropdown-toggle')
        .attr('role','button')
        .attr('data-toggle','dropdown')
        .attr('aria-haspopup','true')
        .attr('aria-expanded','false');
    let _nav = $('body').html();
    res.json({status:1,msg:'请求成功',menu:_nav});
    //res.send(_nav);
  });
})
.get('/marquee',(req,res)=>{
  let Article = require('../model/article'),
  length = req.query.length || 10;
  Article.find({status:false},'_id title date',(e,r)=>{
     if(e){
       res.json({status:1,msg:'查询失败'});
       return;
     }
     res.json({status:1,msg:'查询成功',data:r});
  }).sort({_id:-1}).limit(length);
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
          return res.json({
            status:1,
            msg:'查询成功',
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
      if(e){
        res.json({status:0,msg:'查询失败'});
        return;
      }
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
        res.json({status:1,msg:'查询成功',article:arc,pre:pre,next:nex,com:r1});
      }).limit(length).sort({_id:-1});
    });
})
.get('/article',(req,res)=>{
  let l = parseInt(req.query.limit) || 12;
  let Article = require('../model/article');
  Article.find({status:false,recover:false},'_id title author keywords description content hits date',(e,r)=>{
     if(e){
       res.json({status:0,msg:'查询失败'});
       return;
     }
     for (var i = 0; i < r.length; i++) {
       let html = helper.decodeHtml(r[i].content);
       html = helper.delHtmlTag(html).substring(0,150);
       r[i].content = html;
       //r[i].content = helper.delHtmlTag(helper.decodeHtml(r[i].content));
     }
     res.json({status:1,msg:'查询成功',data:r});
     return;
  }).sort({_id:-1}).limit(l);
})
.get('/round',(req,res)=>{
  let Article = require('../model/article'),
  length = req.query.length || 15,
  _fid = req.query.fid || req.session._fid;
  let query={fid:_fid,status:false,recover:false};
  if(!_fid){
    delete query['fid'];
  }
  Article.getArticleRound(query,length,(e,r)=>{
    if(e){
      res.json({status:0,msg:'查询失败'});
    }
    res.json({status:1,msg:'查询成功',data:r});
  });
})
.get('/com',(req,res)=>{
  let Article = require('../model/article'),
  length = req.query.length || 15,
  Colunm =require('../model/colunm'),
  _fid = req.query.fid || req.session._fid;
  let query={fid:_fid,status:false,recover:false};
  if(!_fid){
    delete query['fid'];
  }
  Article.find(query,'_id title description date',(e,r)=>{
    if(e){
      res.json({status:0,msg:'查询失败'});
    }
    res.json({status:1,msg:'查询成功',data:r});
  }).limit(length).sort({hits:1});
});

module.exports = router;
