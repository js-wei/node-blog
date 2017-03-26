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
/*
var data=[
    {id:1,pId:0,cId:1,name:"A"},
    {id:11,pId:1,cId:1,name:"A1"},
    {id:12,pId:1,cId:2,name:"A2"},
    {id:13,pId:1,cId:3,name:"A3"},
    {id:22,pId:2,cId:2,name:"B2"},
    {id:31,pId:3,cId:1,name:"C1"},
    {id:32,pId:3,cId:2,name:"C2"},
    {id:33,pId:3,cId:3,name:"C3"},
    {id:2,pId:0,cId:2,name:"B"},
    {id:21,pId:2,cId:1,name:"B1"},
    {id:36,pId:31,cId:3,name:"C13"},
    {id:37,pId:36,cId:1,name:"C131"},
    {id:23,pId:2,cId:3,name:"B3"},
    {id:3,pId:0,cId:3,name:"C"},
    {id:34,pId:31,cId:1,name:"C11"},
    {id:35,pId:31,cId:2,name:"C12"},
    {id:38,pId:37,cId:1,name:"C1311"}
];
 */
exports.treeMenu=(tree)=>{
   var newTree = [];
   var tmp = [];
   var item = [];
   //遍历数组，建立临时扁平数据
   for(var x in tree){
       item[tree[x].id] = [tree[x].name];
   }
   //遍历数组，同时获取每个对象的父节点和子节点数据
   for(var x in tree){
       var parentId = tree[x].pId;
       var childId = tree[x].cId;
       //该对象的父元素节点在临时数据中的对应位置有数据存在时
       //说明这是一个二级以上的节点
       //将它的数据传递给父节点对应的子节点位置
       if(item[parentId]){
           item[parentId][childId] = item[tree[x].id];
       }
       //如果没有，说明这是一个一级节点，直接传递给最终结果
       else{
           newTree.push(item[tree[x].id]);
       }
       //因为传递的值为引用值，所以当处理数据时
       //对子节点进行操作后,同样会反映到父节点中，最后体现在最终结果里
   }
   item = null; // 解除临时数据
   return newTree;
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
    q= obj.search || {},
    col=obj.columns || '';
    var pageNumber=obj.page.num || 1;
    var resultsPerPage=obj.page.limit || 10;
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
        console.log(s);
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
