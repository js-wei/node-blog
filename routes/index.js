'use strict'
let express = require('express'),
router = express.Router(),
<<<<<<< HEAD
helper = require('../model/helper'),
renderer = require('vue-server-renderer').createRenderer(),
fs = require('fs'),
path = require('path');
=======
helper = require('../model/helper');

router.use((req,res,next)=>{
    next();
});
>>>>>>> 22fd42b515d623e21da48891d11d6feaf0e72434

router.get('/', function(req, res, next){
<<<<<<< HEAD
  res.render('index');
=======
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
>>>>>>> 22fd42b515d623e21da48891d11d6feaf0e72434
});
module.exports = router;
