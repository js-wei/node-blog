function version(){
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect('mongodb://localhost:27017/admin', function(err, db) {
	  db.collection('system.version').findOne({},function(err, doc) {
		  this.l=doc.version;
		  db.close();
      });
	});
}
module.exports=version;