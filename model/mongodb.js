var config = require('config-lite'),
MongoClient = require('mongodb').MongoClient;

//大小
size=(callback)=>{
	MongoClient.connect(config.mongodb, function(err, db) {
			db.stats((e,r)=>{
				callback((r.storageSize/1024/1024).toFixed(2)+'M');
			});
			db.close();
	});
}
//版本
version=(callback)=>{
	//直接调用命令
	var child_process = require('child_process');
	var command = 'mongo --eval "db.version()"';
	child_process.exec(command, function (err, stdout, stderr) {
			var ver = stdout.split('\r\n');
	    callback(ver[3]);
	});
}
express = (callback)=>{
	var child_process = require('child_process');
	var command = 'express --version';
	child_process.exec(command, function (err, stdout, stderr) {
			callback(stdout);
	});
};
express((e)=>{
	exports.express = e;
});
version((v)=>{
	exports.version = v;
});
size((s)=>{
	exports.size = s;
});
