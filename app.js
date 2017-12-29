/**
 * @Author: 魏巍
 * @Date:   2017-12-27T17:36:49+08:00
 * @Email:  524314430@qq.com
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-29T16:52:49+08:00
 */



var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
const tools = require('./tools');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var uploadify = require('./routes/uploadify');  //文件上传
var api = require('./routes/api')
var config = require('config-lite'),            //读取配置文件
ejs = require('ejs');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'files')));
app.use(express.static(path.join(__dirname, 'uploads')));

//开启session
app.use(session(config.session));

//配置路由
app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/uploadify',uploadify);
app.use('/api',api);

//扩展模板截取方法
app.locals.ellipsis=(str,start=0,len,flag=false)=>{
    var _str = str.substr(start,len || str.toString().length);
    _str = flag?_str+"...":_str;
    return _str;
}
//扩展模板时间格式化
app.locals.time=(nS,format='yyyy-MM-dd h:i:s')=>{
    if(nS==''||nS==null){
        return '';
    }
    nS = nS.toString().length<13?parseInt(nS)*1000:parseInt(nS);
    var d = new Date(nS);
    var date = {
        "M+": d.getMonth() + 1,
        "d+": d.getDate(),
        "h+": d.getHours(),
        "m+": d.getMinutes(),
        "i+": d.getMinutes(),
        "s+": d.getSeconds(),
        "q+": Math.floor((d.getMonth() + 3) / 3),
        "S+": d.getMilliseconds()
   };
   if (/(y+)/i.test(format)) {
         format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
   }
   for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
               format = format.replace(RegExp.$1, RegExp.$1.length == 1
                      ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
   }
   return format;
};
app.locals.decodeHtml=(html)=>{
  var map = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'"
  };
  return html.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(config.port, function () {
 tools.open_url();
});
module.exports = app;
