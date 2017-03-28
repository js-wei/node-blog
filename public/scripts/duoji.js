//根据最后一个找到整个家族
function familyTree(arr, pid) {
    var temp = [];
    var forFn = function(arr, pid){
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item.id == pid) {
                temp.push(item);
                forFn(arr,item.parent_id);
            }
        }
    };
    forFn(arr, pid);
    return temp;
}
//子孙树，从顶级往下找到是有的子子孙孙
function sonsTree(arr,id){
    var temp = [],lev=0;
    var forFn = function(arr, id,lev){
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item.parent_id==id) {
                item.lev=lev;
                temp.push(item);
                forFn(arr,item.id,lev+1);
            }
        }
    };
    forFn(arr, id,lev);
    return temp;
}

function getDom(data){
    var tree = sonsTree(data,0);
    var temp = [];
    temp[0]="<ul>";
    for(var i=0;i<tree.length;i++){
        var item = tree[i],u = "";
        if(i>0){
            u = "</ul>";
        }
        if(item['lev']==0){
            temp.push(u+'<li><a class="one" data-toggle="dropdown" data-hover="dropdown" aria-expanded="false">'+item.address+'</a><ul class="dropdown">');
        }else{
            temp.push('<li><a>'+item.address+'</a></li>')
        }
        if(i+1==tree.length){
            temp.push("</ul>")
        }
    }
    return temp.join("");
}
