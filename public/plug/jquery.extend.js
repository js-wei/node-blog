(function($,undefined){
	 $.extend({
        timeStamp:function(date=''){
        	var timestamp = Date.parse(new Date(date));
    			timestamp = timestamp / 1000;
    			return timestamp;
        },
        getTime:function(nS,format='yyyy-MM-dd h:i:s'){
        	var d = new Date(parseInt(nS) * 1000);
        	var date = {
              "M+": d.getMonth() + 1,
              "d+": d.getDate(),
              "h+": d.getHours(),
              "m+": d.getMinutes(),
              "i+": d.getMinutes(),
              "s+": d.getSeconds(),
              "q+": Math.floor((d.getMonth() + 3) / 3),
              "S+": d.getMilliseconds()
	       };
	       if (/(y+)/i.test(format)) {
	             format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
	       }
	       for (var k in date) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
              }
	       }
	       return format;
		},
    dataTemplate:function(template,data){
        template = template.toLowerCase();
		    var outPrint="";
		    var matchs = template.match(/\{[a-zA-Z]+\}/gi);
		    var temp="";
		    for(var j = 0 ; j < matchs.length ;j++){
		        if(temp == "")  temp = template;
		        var re_match = matchs[j].replace(/[\{\}]/gi,"");
		        temp = temp.replace(matchs[j],data[re_match]);
		    }
		    outPrint += temp;
		    return outPrint;
    },
    serializeJson: function(){
      var obj = {};
      var count = 0;
      $.each( this.serializeArray(), function(i,o){
          var n = o.name, v = o.value;
          count++;
          obj[n] = obj[n] === undefined ? v: $.isArray( obj[n] ) ? obj[n].concat( v ): [ obj[n], v ];
      });
      obj.hasCount = count + "";
      obj.time = Date.parse(new Date())/ 1000;
      return $.parseJSON(JSON.stringify(obj));
    };
});
})(jQuery);
