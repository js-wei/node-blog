/**
 * @Author: 魏巍
 * @Date:   2017-12-03T12:18:04+08:00
 * @Email:  jswei30@gmail.com
 * @Filename: users.js
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-03T12:25:25+08:00
 */



var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
}).
get('/register',(req,res)=>{
    let Admin = require('../model/admin'),
    helper = require('../model/helper');
    admin = new Admin({
        name:'admin',
        password:helper.password('123456')
    });
    Admin.update({_id:'58de00747dd1aa364a24038e'},{$set:{name:'524314430@qq.com'}},(e,r)=>{
        if(e){
          res.json(e);
          return;
        }
        res.json(r);
    });
});

module.exports = router;
