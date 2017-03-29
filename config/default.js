module.exports = {
  port: 3000,
  session: {
    secret: 'jswei30',
    key: 'jswei30',
    maxAge: 60*60*24,
    resave:false,
    saveUninitialized: true,
  },
  encrypt:'jswei30',    //加密字符串
  mongodb: 'mongodb://localhost:27017/blog',
  pagination:5
};
