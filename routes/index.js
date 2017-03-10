var express = require('express'),
router = express.Router(),
Admin = require('../model/admin'),
helper = require('../model/helper');

/* GET home page. */
router.get('/', function(req, res, next) {
  var pwd = helper.password('123456');
  var user = new Admin({
    name:'524314430@qq.com',
    password:pwd,
    logindate:Date.now(),
    loginip:helper.get_client_ip,
    status:0
  });
  user.save(function (err, res) {
      if (err) console.log(err);
  });
  res.render('index', { title: 'Express',err:pwd});
});

module.exports = router;
