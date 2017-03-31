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
              <p v-html="article.content.substring(0,110)"></p>
            </a>
        </div>`
    };
    let _round={
      props:['item'],
      template:`<li><a :href="'/topic/'+item._id" v-text="item.title"></a></li>`
    };

    // 创建根实例
    new Vue({
      el: '.main-body',
      components:{
        'marquee':marquees,
        'arclist':articles,
        'round':_round,
        'recommend':_round,
      },
      data: {
        nav:[],
        marquee:[],
        article:[],
        navHtml:'',
        rounds:[],
        com:[]
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
  if($('table:first tr').find('th:nth-child(2)').text()=='十六进制颜色值'){
    $('table tr').each(function(index, el) {
       let color = $(this).find('td:nth-child(2)').text();
       if(color!=''){
         $(this).find('td:nth-child(3)').css({'background-color':color});
       }
    });
  }
  if($('table:first tr').find('th:nth-child(2)').text()=='Color HEX') {
    $('table tr').each(function(index, el) {
       let color = $(this).find('td:nth-child(2)').text();
       if(color!=''){
         $(this).find('td:nth-child(1)').css({'background-color':color});
       }
    });
  }
  if($('table:eq(2) tr th').length==6) {

    $('table:eq(2) tr th,table:eq(2) tr td').each(function(index, el) {
       let color = $(this).text();
       console.log(color);
       if(color!=''){
         $(this).css({'background-color':"#"+color});
       }
    });
  }
});
