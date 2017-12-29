/**
 * @Author: 魏巍
 * @Date:   2017-12-29T16:36:57+08:00
 * @Email:  524314430@qq.com
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-29T16:43:04+08:00
 */
module.exports={
    open_url:()=>{
      let os = require('os'),
      config = require('config-lite'),
      lacalhost = '';
      try {
        var network = os.networkInterfaces()
        localhost = network[Object.keys(network)[0]][1].address
      } catch (e) {
        localhost = 'localhost';
      }
      var uri = 'http://' + localhost + ':' + config.port;
      console.log('Perfect Server is start on ' + uri);
    }
}
