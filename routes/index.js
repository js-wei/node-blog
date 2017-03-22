'use strict'
var express = require('express'),
router = express.Router(),
helper = require('../model/helper'),
renderer = require('vue-server-renderer').createRenderer(),
fs = require('fs'),
path = require('path');

router.get('/', function(req, res, next){
  res.render('index');
});

module.exports = router;
