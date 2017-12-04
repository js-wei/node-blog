/**
 * @Author: 魏巍
 * @Date:   2017-12-03T12:17:55+08:00
 * @Email:  jswei30@gmail.com
 * @Filename: mongodb.js
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-03T12:24:26+08:00
 */



var config = require('config-lite'),
MongoClient = require('mongodb').MongoClient,
fs = require('fs');
//模板版本信息
tpl=(callback)=>{
		let path = __dirname+'/../package.json';
		fs.readFile(path, 'utf8', (err, data) => {
		  if (err) throw err;
			data = JSON.parse(data);
			var t = data.dependencies.ejs?'ejs':'jade';
			var v = data.dependencies.ejs || data.dependencies.ejs.jade;
		  callback({tpl:t,version:v.substr(1)});
		});
};
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
			stdout = stdout.split('\n') || stdout.split('\r\n');
			stdout = stdout[3];
	    callback(stdout);
	});
}
express = (callback)=>{
	var child_process = require('child_process');
	var command = 'express --version';
	child_process.exec(command, function (err, stdout, stderr) {
			callback(stdout);
	});
};
tpl((t)=>{
	exports.templete = t;
});
express((e)=>{
	exports.express = e;
});
version((v)=>{
	exports.version = v;
});
size((s)=>{
	exports.size = s;
});
