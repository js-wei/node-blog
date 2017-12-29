/**
 * @Author: 魏巍
 * @Date:   2017-12-29T14:46:11+08:00
 * @Email:  524314430@qq.com
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-29T16:46:24+08:00
 */
module.exports = {
  port: 3010,
  session: {
    secret: 'jswei30',
    key: 'jswei30',
    maxAge: 60*60*24,
    resave:false,
    saveUninitialized: true,
  },
  encrypt:'jswei30',    //加密字符串
  mongodb: 'mongodb://localhost:27017/blog',
  pagination:10
};
