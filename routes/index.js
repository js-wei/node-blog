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
    statusL:0
  });
  user.save(function (err, res) {
      if (err) {
          console.log("Error:" + err);
      }
  });
  res.render('index', { title: 'Express'});
});

module.exports = router;
