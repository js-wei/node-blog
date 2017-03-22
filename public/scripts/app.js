$(function(){
    $('.feature-item').mouseover(function(){
        $(this).addClass('active');
        $(this).find('h2,p').addClass('active');
    }).mouseout(()=>{
        $('.feature-item').removeClass('active');
        $('.feature-item').find('h2,p').addClass('active');
    });
    var Child = {
      props: ['message'],
      template: '<h1>{{message}}</h1>'
    };
    var List = {
      props: ['todo'],
      template: '<li><a v-bind:href="todo._id">{{todo.title}}</a></li>'
    };

    // 创建根实例
    new Vue({
      el: '.nav',
      components:{
        'list':List
      },
      data: {
        pepole:[]
      },
      created:function(){
        var _self = this;
        axios.get('/colunm')
        .then(function(response){
          _self.pepole = response.data;
        })
        .catch(function (error) {

        })
      }
  });
  $('#marquee').kxbdMarquee({
    direction:'left'
  });
});
