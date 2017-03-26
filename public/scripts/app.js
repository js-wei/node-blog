$(function(){
    var List = {
      props: ['item'],//data-toggle="dropdown" data-hover="dropdown" aria-expanded="false"
      //template: `<li><a :href="'/category/'+nav.name">{{nav.title}}</a></li>`
      template:`
       <li role='presentation' v-if='!item.fid'><a href="#">{{item.title}}</a></li>
       <li role='presentation' v-if='item.fid'>
          <a href="#" data-toggle="dropdown" data-hover="dropdown" aria-expanded="false">
            {{item.title}}
          </a>
           <ul v-show='item.expanded' class="dropdown">
               <li v-for='child in item.fid'><a href="#">{{child.title}}</a></li>
           </ul>
       </li>
      `
    };
    var marquees ={
      props:['marquee'],
      template:`<li><a :href="'/topic/'+marquee._id" :key="marquee.id">{{marquee.title}}</a></li>`
    }
    var articles={
      props:['article'],
      template:`<div class="col-md-3 col-sm-6 col-xs-12 feature-item">
               <a :href="'/topic/'+article._id">
              <h2><!--<i class="fa fa-flask"></i>-->{{article.title}}</h2>
              <p>{{article.description}}</p>
            </a>
        </div>`
    };
    // 创建根实例
    new Vue({
      el: '.main-body',
      components:{
        'navigater':List,
        'marquee':marquees,
        'arclist':articles
      },
      data: {
        nav:[],
        marquee:[],
        article:[],
        navHtml:'',
        menus: [{
                text: '水果',
                expanded: false,
                children: [
                    {
                        text: '苹果',
                    },
                    {
                        text: '荔枝'
                    },
                    {
                        text: '葡萄'
                    },
                    {
                        text: '火龙果'
                    }
                ]
            },
            {
                text: '好吃的',
                expanded: false,
                children: [
                    {
                        text: '糖',

                    },
                    {
                        text: '面包'
                    },
                    {
                        text: '火腿'
                    },
                    {
                        text: '薯片'
                    },
                    {
                        text: '碎碎面'
                    }
                ]
            },
            {
                text: '饮料',
                expanded: false,
                children: [

                ]
            }
        ]
      },
      created:function(){
          var _self = this;
          axios.get('/colunm')
          .then(response=>{
            _self.nav = response.data;
          })
          .catch(function (error) {
          });
          axios.get('/marquee')
          .then(function(response){
              _self.marquee = response.data;
          })
          .catch(function (error) {
          });
          axios.get('/article')
          .then(function(response){
              _self.article = response.data;
          })
          .catch(function (error) {
          });
      },
      methods:{
          tree:(arr,id='',mar=10)=>{
            var temp = [],lev=0;
            var forFn = function(arr,id,lev){
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    if (item.fid==id) {
                        item.lev=lev;
                        item.mar=lev*mar;
                        temp.push(item);
                        forFn(arr,item._id,lev+1);
                    }
                }
            };
            forFn(arr,id,lev);
            return temp;
          },
          toggleChildren: function(item) {
            item.expanded = !item.expanded;
          }
      }
  });
});
