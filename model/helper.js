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
//console.log(sonsTree(data,0));
html=(l,t='--')=>{
  var _r='';
  for (var i = 0; i <l; i++) {
    _r += t;
  }
  console.log(l);
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

exports.genTree = (list)=> {
     var temptree = [], tree = [], items = [];
     for (var i in list) {
         if (!temptree[list[i]._id]) {
             var trow = {
                 _id: list[i]._id,
                 fid: list[i].fid,
                 text: list[i].title,
                 status: list[i].status,
                 children: []
             };
             temptree[list[i]._id] = trow;
             items.push(trow);
         }
     }
     for (var j in items) {
         if (temptree[items[j].fid]) {
             temptree[items[j].fid]['children'].push(temptree[items[j]._id]);
         } else {
             tree.push(temptree[items[j]._id]);
         }
     }
     temptree = null;
     items = null;
     return tree;
 };
