var config = require('config-lite'),
MongoClient = require('mongodb').MongoClient;

//大小
function size(callback){
	MongoClient.connect(config.mongodb, function(err, db) {
			db.stats((e,r)=>{
				callback((r.storageSize/1024/1024).toFixed(2)+'M');
			});
			db.close();
	});
}
//版本
function version(callback){
	MongoClient.connect('mongodb://localhost:27017/admin', function(err, db) {
			db.collection('system.version').findOne({},function(err, doc) {
				callback(doc.version+'.*');
				db.close();
			});
	});
}

version((v)=>{
	exports.version = v;
});
size((s)=>{
	exports.size = s;
});
