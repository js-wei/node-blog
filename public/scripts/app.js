$(function(){
    let marquees ={
      props:['marquee'],
      template:`<li><a :href="'/topic/'+marquee._id" :key="marquee.id">{{marquee.title}}</a></li>`
    }
    let articles={
      props:['article'],
      template:`<div class="col-md-3 col-sm-6 col-xs-12 feature-item">
               <a :href="'/topic/'+article._id">
              <h2 v-text="article.title"><!--<i class="fa fa-flask"></i>--></h2>
              <p v-html="article.content.substring(0,120)"></p>
            </a>
        </div>`
    };
    let _round={
      props:['item'],
      template:`<li><a :href="'/topic/'+item._id" v-text="item.title"></a></li>`
    },
    _meta = {
      props:['item'],
      template:`<meta name="keywords" content="item.keywords" />
      <meta name="description" content="item.keywords" />`
    };

    // 创建根实例
    new Vue({
      el: '.main-body',
      components:{
        'marquee':marquees,
        'arclist':articles,
        'round':_round,
        'recommend':_round,
        'mates':_meta
      },
      data: {
        nav:[],
        marquee:[],
        article:[],
        navHtml:'',
        rounds:[],
        com:[],
        category:'',
      },
      created:function(){
          let _self = this;
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
          axios.get('/round')
          .then(function(response){
              _self.rounds = response.data;
          })
          .catch(function (error) {
          });
          axios.get(`/com`)
          .then(function(response){
              _self.com = response.data;
          })
          .catch(function (error) {
          });
      },
      methods:{
        delHtmlTag:(str)=>{
            return s.replace(/<(?:.|\s)*?>/g,"");
        }
      }
  });
});
