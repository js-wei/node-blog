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
 exports.genTreeLevel = (list)=> {
      var temptree = [], tree = [], items = [];
      for (var i in list) {
          if (!temptree[list[i]._id]) {
              var trow = {
                  _id: list[i]._id,
                  fid: list[i].fid,
                  text: list[i].title,
                  status: list[i].status,
                  level: 1,
              };
              temptree[list[i]._id] = trow;
              items.push(trow);
          }
      }
      for (var j in items) {
          //console.log(items[j]._id);
          if (temptree[items[j].fid]) {
              //temptree[items[j].fid]['children'].push(temptree[items[j]._id]);
              items[j]['level'] += 1;
          }
          tree.push(temptree[items[j]._id]);
      }
      temptree = null;
      items = null;
      return tree;
  };

  function unlimitForLevel(cate,fid='',level=0,html='|--',margin=15){
		arr=[];
		for(x in  cate) {
      //console.log(cate[x]);
			if(cate[x]['fid']==fid){
				cate[x].level=level+1;
				cate[x].html=html;
				cate[x].margin=level*margin;
				arr.push(cate[x]);
        console.log(cate[x]);
        arr = arr.concat(arr,unlimitForLevel(cate,cate[x]['id'],level+1,html,margin));
			}
		}
		return arr;
  }

  exports.unlimitForLevel = unlimitForLevel;
