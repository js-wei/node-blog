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

       let html='<ul class="nav navbar-nav navbar-right main-nav">';
       $.each(r,function(k,v) {
          if(v.fid==''){
            let item =`<li fid="${v._id}"><a href="/category/${v.name}">${v.title}</a></li>`;
            console.log(item);
						$(".main-nav").append(item);
					}else{
						if($("#comment"+v.fid).find(".comments").length==0){
                let item='';
                item +=`<ul class="dropdown" id="comments${v._id}" class="comments"><li fid="${v._id}"><a href="/category/${v.name}">${v.title}</a></li></ul>`;
                $("#comment"+v.sortID).append(item);
            }else{
                let item =`<li fid="${v._id}"><a href="/category/${v.name}">${v.title}</a></li>`;
  							$("#comments"+v.sortID).append(item);
						}
					}
       });
       console.log(html);
       res.json(r);
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
