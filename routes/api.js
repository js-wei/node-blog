/**
 * @Author: 魏巍
 * @Date:   2017-12-27T17:42:31+08:00
 * @Email:  524314430@qq.com
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-28T17:52:43+08:00
 */

var express = require('express');
var router = express.Router(),
  helper = require('../model/helper');

router.get('/', (req, res) => {
  res.send('This is api controller!');
}).
get('/colunm', (req, res) => {
  let Colunm = require('../model/colunm'),
    $ = require('jquery')(require("jsdom").jsdom().defaultView);
  Colunm.find({
    status: true
  }, '_id title name  fid', (e, r) => {
    if (e) {
      res.json({
        msg: e
      });
      return;
    }
    let html = `<ul class="navbar-nav mr-auto"> </ul>`;
    $('body').append(html);
    $.each(r, function(k, v) {
      if (v.fid == '') {
        let html = `
 <li class="nav-item comment${v._id}">
  <a  href="/" class="nav-link">${v.title}</a>
 </li>
`;
        $(".navbar-nav").append(html);
      } else {
        if ($(".comment" + v.fid).find(".dropdown-menu").length == 0) {
          let tpl = `  <div class="dropdown-menu dropdown-menu-left comment${v._id}" aria-labelledby="navbarDropdown_${v._id}">
              <a href="/category/${v.name}">${v.title}</a>
        </div>
</li>`;
          $(`li.comment${v.fid}`).append(tpl);
          $(`li.comment${v.fid}`).addClass('dropdown');
          $(`li.comment${v.fid}`).attr('id',`navbarDropdown_${v._id}`);
        } else {
          let a = `<a href="/category/${v.name}" class="dropdown-item">${v.title}</a>`;
          $(`.comment${v.fid} div`).append(a);
        }
      }
    });
    $(`li.dropdown`).children('a').addClass('dropdown-toggle')
        .attr('role','button')
        .attr('data-toggle','dropdown')
        .attr('aria-haspopup','true')
        .attr('aria-expanded','false');
    let _nav = $('body').html();
    //res.json({status:1,menu:_nav});
    res.send(_nav)
    return;
  });
});

module.exports = router;
