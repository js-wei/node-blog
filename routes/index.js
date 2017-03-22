'use strict'
let express = require('express'),
router = express.Router(),
helper = require('../model/helper');

router.use((req,res,next)=>{
    next();
});

/* GET home page. */
router.get('/', function(req, res, next){
    res.render('index/index');
})
.get('/colunm',(req, res)=>{
  let Colunm = require('../model/colunm');
  Colunm.find({fid:'',status:true},'_id title name date',(e,r)=>{
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
  Article.find({status:false},'_id title name',(e,r)=>{
       if(e){
         res.json({msg:e});
         return;
       }
       res.json(r);
       return;
  }).sort({date:-1});
})
.get('/community',(req,res)=>{
    res.render('index/list');
});
module.exports = router;
