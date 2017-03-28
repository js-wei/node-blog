'use strict'
let express = require('express'),
router = express.Router(),
helper = require('../model/helper');

router.use((req,res,next)=>{
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
                let div=`<ul class="dropdown-menu"><li id="comment${v._id}" class="comments"><a href="/category/${v.name}">${v.title}</a></li></ul>`;
                $(`li#comment${v.fid}`).append(div);
            }else{
                let item =`<li class="comments" id="comment${v._id}"><a href="/category/${v.name}">${v.title}</a></li>`;
  							$(`#comment${v.fid} ul`).append(item);
						}
					}
       });
       let m ='<li><a href="https://github.com/js-wei"><i class="fa fa-github"></i></a></li><li><a href="tel:1358486592"><i class="fa fa-phone"></i></a></li>';
       $(".main-nav").append(m);
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
.get('/category/:id',(req,res)=>{
    let id = req.params.id || '';
    console.log(id);
    res.render('index/list');
})
.get('/topic/:id',(req,res)=>{
    res.render('index/article');
})
.get('/test',(req,res)=>{
    res.render('index/test');
});
module.exports = router;
