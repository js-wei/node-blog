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
  let Colunm = require('../model/colunm');
  Colunm.find({status:true},'_id title name date fid',(e,r)=>{
       if(e){
         res.json({msg:e});
         return;
       }
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
});
module.exports = router;
