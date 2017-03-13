var express = require('express'),
router = express.Router(),
helper = require('../model/helper');

/* GET home page. */
router.get('/', function(req, res, next) {
  let Comment = require('../model/comment');
  var comment = new Comment({
    fid:'58c614bced56fe18ac89d152',
    aid:'58c0cb9394507012c41dea2f',
    title:'女子专权必祸国',
    content:'纵观中华5000年女子专权必祸国',
    ip:helper.get_client_ip
  });
  comment.save(function (err, res) {
      if (err) console.log(err);
  });
  res.render('index', { title: 'Express',err:JSON.stringify(comment)});
});

module.exports = router;
