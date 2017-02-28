var express = require('express');
var router = express.Router();
var Admin = require('../model/admin.js'),
md5 = require('md5');

/* GET home page. */
router.get('/', function(req, res, next) {

  var user = new Admin({
    name:'admin',
    password:md5('123456'),
    logindate:new Date().getTime(),
    loginip:'127.0.0.1',
    status:0
  });
  var msg = '';
  user.save(function (err, res) {
      if (err) {
          msg =  err.message;
          console.log(err.errors);
          console.log(err.message);
      }
  });
  res.render('index', { title: 'Express',err:msg});
});

module.exports = router;
