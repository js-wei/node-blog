/**
 * @Author: 魏巍
 * @Date:   2017-12-03T12:17:55+08:00
 * @Email:  jswei30@gmail.com
 * @Filename: helper.js
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-28T15:32:43+08:00
 */



var config = require('config-lite'),
md5 = require('md5'),
crypto = require('crypto');


//重组密码
exports.password=(str)=>{
    return md5(str+"$"+config.encrypt).substr(20);
}


exports.delHtmlTag=(str)=>{
    return str.replace(/<[^>]+>/g,"");
}

//加密
exports.cipher = (algorithm, key, buf)=>{
    var encrypted = "";
    key = key || config.encrypt;
    var cip = crypto.createCipher(algorithm, key);
    encrypted += cip.update(buf, 'binary', 'hex');
    encrypted += cip.final('hex');
    return encrypted
};

//解密
exports.decipher = (algorithm, key, encrypted) =>{
    var decrypted = "";
    var decipher = crypto.createDecipher(algorithm, key);
    decrypted += decipher.update(encrypted, 'hex', 'binary');
    decrypted += decipher.final('binary');
    return decrypted
};

//根据最后一个找到整个家族
exports.familyTree=(arr, pid)=>{
    var temp = [];
    var forFn = function(arr, pid){
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item.id == pid) {
                temp.push(item);
                forFn(arr,item.fid);
            }
        }
    };
    forFn(arr, pid);
    return temp;
}

module.exports.tree=(data)=>{
    data.forEach(function (item) {
        delete item.children;
    });
    var map = {};
    data.forEach(function (item) {
        map[item.id] = item;
    });
    var val = [];
    data.forEach(function (item) {
        var parent = map[item.fid];
        if (parent) {
            (parent.children || ( parent.children = [] )).push(item);
        } else {
            val.push(item);
        }
    });
    return val;
}

module.exports.jq = function(){
    var request = require('request');
    var jsdom = require("jsdom");
    var jquery = require('jquery');
    var $ = jquery(jsdom.jsdom().parentWindow);
    var Iconv = require('iconv').Iconv;

    $.extend({
        get: function() {
            var url, charset, callback;
            if (arguments.length == 2) {
                url = arguments[0];
                charset = null;
                callback = arguments[1];
            } else if (arguments.length == 3) {
                url = arguments[0];
                charset = arguments[1];
                callback = arguments[2];
            }
            request({uri: url, encoding: 'binary'}, function(error, response, html) {
                html = new Buffer(html, 'binary');
                if (charset) {
                    charset = {gbk:'gbk'}[charset] || 'gbk';
                    var conv = new Iconv(charset, 'utf8');
                    html = conv.convert(html);
                }
                html = html.toString();

                jsdom.env({
                    html: html,
                    done: function (errors, window) {
                        var result = jquery(window)("html");
                        callback(result);
                    }
                });
            });
        }
    });
    return $;
};
//子孙树，从顶级往下找到是有的子子孙孙
exports.sonsTree=(arr,id='',mar=10,t='--')=>{
    var temp = [],lev=0;
    var forFn = function(arr,id,lev){
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item.fid==id) {
                item.lev=lev;
                item.mar=lev*mar;
                item.html=html(lev,t);
                temp.push(item);
                forFn(arr,item._id,lev+1);
            }
        }
    };
    forFn(arr,id,lev);
    return temp;
}
//生成占位符
html=(l,t='--')=>{
  var _r='';
  for (var i = 0; i <l; i++) {
    _r += t;
  }
  return _r;
};
exports.getDom=()=>{
  var tree = sonsTree(data,0);
  var temp = [];
  for(var i=0;i<tree.length;i++){
      var item = tree[i],u = "<ul>";
      if(i>0){
          u = "</ul>";
      }
      if(item['lev']==0){
          temp.push(u+'<li><a class="one">'+item.address+'</a><ul>');
      }else{
          temp.push('<li><a>'+item.address+'</a></li>')
      }
      if(i+1==tree.length){
          temp.push("</ul>")
      }
  }
};

site=(callback)=>{
    let Config = require('./config');
    Config.findOne({},(e,r)=>{
        if(e) callback(e,null);
        callback(null,r);
    });
};

site((e,r)=>{
	exports._site = r;
});



//获取IP
// require('externalip')(function (err, ip) {
//     console.log(ip);
//   //exports.get_client_ip = ip; // => 8.8.8.8
// });
exports.get_client_ip=(req)=>{
    let ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0];
        if(ip.length >=15){
           ip = ip.slice(7);
        }
    }
    return ip;
}

/*
var options = {
     currentPage:<%=page.num%>,
     totalPages:<%=page.pageCount%>,
     numberOfPages:<%=page.numberOf%>,
     version:3,
     pageUrl: function(type, page, current){
       return "<%=_url%>?p="+page;
     },
}
$('.pages').bootstrapPaginator(options);
var model = {
     order:{rdate:-1},
     search:'',
     columns:'',
     page:['num':5,'limit':10],
 };
 helper.pagination(model,(err,pageCount,list)=>{
     page['pageCount']=pageCount;
     page['size']=list.length;
     page['numberOf']=pageCount>5?5:pageCount;
     return res.render('*tpl', {
       list:list,
       page:page,
       count:20
     });
 },req);
 */

//分页方法
exports.pagination  =(obj,callback,req=null)=>{
    var mdel=null;
    if(!obj.model){
      var m = req.path.replace(/\//g,'');
      m = (m.indexOf('_')>-1)? m.split('_')[1]:m;
      mdel = require('../model/'+m);  //导入模型
    }
    var model= obj.model || mdel,
    q= obj.search || {},
    col=obj.columns || '';
    var pageNumber=obj.page.num || 1;
    var resultsPerPage=obj.page.limit || config.pagination;
    var order = obj.order || {};
    var populate = obj.populate || '';
    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
    var query = model.find(q,col).populate(populate).sort(order).skip(skipFrom).limit(resultsPerPage);
    query.exec((error, results)=>{
      if(error){
           callback(error, null, null);
      }else{
           model.count(q,(error, count)=>{
            if(error){
              callback(error, null, null);
            }else{
              var pageCount = Math.ceil(count / resultsPerPage)||10;
              callback(null, pageCount, results);
            }
          });
      }
   });
 }
/**
 * [map 映射查询条件]
 * @param  {[type]} req  [HttpRqeust对象]
 * @param  {[type]} more [扩充条件]
 * @return {[type]}      [查询条件]
 */
exports.map = (req,more)=>{
    let query = req.query||req.params||req.body;
    more = more|| null;
    var json = "{";
    if(more!=null){
        for(i in more){
            json += ",'"+i+"'"+":'"+more[i]+"'";
        }
    }

    for(i in query){
        if(i.indexOf('s_')>-1 && query[i]!=''){
            var key = i.split('s_');
            switch (key[1]) {
              case 'keywords':    //关键词
                  let k = 'title',k1='keywords';
                  if(query.filter!=''){
                      k = query.filter;
                  }
                  if(query.filter1!=''){
                      k1 = query.filter1;
                  }
                  json += ',"$or":[{"'+k+'":'+new RegExp(query[i])+'}, {"'+k1+'":'+new RegExp(query[i])+'}]';
                break;
              case 'status':    //状态
                  if(query[i]!=-1){
                      json += ',"'+key[1]+'":'+query[i];
                  }
                  break;
              case 'date': //时间
                    var range = (query[i]!='')?query[i].split(' -'):'';
                    let from = (range[0]!=''||range[0]!=null)?Date.parse(new Date(range[0])) : '';
                    let to = (range[1]!=''||range[1]!=null)?Date.parse(new Date(range[1])) : '';
                    if(from && to){
                        json += ',"date":{"$gte":"'+from+'","$lte":"'+to+'"}';
                    }else if(from){
                        json += ',"date":{"$gte":"'+from+'"}';
                    }else{
                        json += ',"date":{"$lt":"'+to+'"}';
                    }
                  break;
              default:    //其他
                json += ",'"+key[1]+"'"+":'"+query[i]+"'";
            }
        }
    }
    json +="}";
    delete query['p'];
    if((json.length>2)){
        let s = json.replace('{,','{');
        s = eval('(' + s + ')');
        return {param:s,search:query};
    }else{
        return {param:'',search:query};
    }
};


//html escape
exports.escapeHtml=(str)=> {
     var map ={
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
     };
     return str.replace(/[&<>"']/g, function(m) {return map[m];});
}
//html decode
exports.decodeHtml=(str)=>{
    var map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
}
