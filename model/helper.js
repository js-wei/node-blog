var config = require('config-lite'),
md5 = require('md5'),
crypto = require('crypto');


//重组密码
exports.password=(str)=>{
    return md5(str+"$"+config.encrypt).substr(20);
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

//获取IP
require('externalip')(function (err, ip) {
  exports.get_client_ip = ip; // => 8.8.8.8
});



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
    q=obj.search||{},
    col=obj.columns;
    var pageNumber=obj.page.num || 1;
    var resultsPerPage=obj.page.limit || 10;
    var order = obj.order || {};

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
    var query = model.find(q,col).sort(order).skip(skipFrom).limit(resultsPerPage);
    query.exec((error, results)=>{
      if(error){
           callback(error, null, null);
      }else{
           model.count(q,(error, count)=>{
            if(error){
              callback(error, null, null);
            }else{
              var pageCount = Math.ceil(count / resultsPerPage);
              callback(null, pageCount, results);
            }
          });
      }
   });
 }
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
