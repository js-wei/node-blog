'use strict'
var express = require('express'),
router = express.Router(),
helper = require('../model/helper'),
renderer = require('vue-server-renderer').createRenderer(),
fs = require('fs'),
path = require('path');
global.Vue = require('vue');

/* GET home page. */
router.get('/', function(req, res, next){
  // let layout = fs.readFileSync('./views/index/index.html', 'utf8');
  // renderer.renderToString(require('../vue/app')(), function (error, html) {
  //   if (error) throw error;
  //
  // });
  res.render('index');
});

module.exports = router;
