$(function(){
    var List = {
      props: ['item'],//data-toggle="dropdown" data-hover="dropdown" aria-expanded="false"
      template: `<li :fid="item._id"><a :href="'/category/'+item.name">{{item.title}}</a></li>`
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
        navHtml:''
      },
      created:function(){
          var _self = this;
          axios.get('/colunm')
          .then(response=>{
            _self.navHtml = response.data;
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

      }
  });
});
