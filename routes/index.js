var express = require('express'),
router = express.Router(),
helper = require('../model/helper');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
