/*
var bmid = 8;
var pids = new Set([bmid]);
do {
    var len = pids.size;
    for(var id in idPidArr) {
        if (pids.has(idPidArr[id])) {
            pids.add(Number(id));
            delete idPidArr[id];
        }
    }
} while (pids.size>len);
*/


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
    //console.log(familyTree(data,10));
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
  //console.log(temp.join(""));
};
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
 */
//分页方法
exports.pagination  =(obj,callback,req=null)=>{
    var mdel='';
    if(req){
      var m = req.path.replace(/\//g,'');
      if(m.indexOf('_')>-1){
        m = m.split('_')[1];
      }
      mdel = require('../model/'+m);
    }
    var model= obj.model || mdel,
    q=obj.search||{},
    col=obj.columns;
    var pageNumber=obj.page.num || 1;
    var resultsPerPage=obj.page.limit || 10;
    var order = obj.order || {};

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
    var query = model.find(q,col).sort(order).skip(skipFrom).limit(resultsPerPage);
    query.exec(function(error, results) {
      if (error) {
        callback(error, null, null);
      } else {
         model.count(q, function(error, count) {
          if (error) {
            callback(error, null, null);
          } else {
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
