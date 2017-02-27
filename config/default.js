module.exports = {
  port: 3000,
  session: {
    secret: 'jswei30',
    key: 'jswei30',
    maxAge: 60*60*24,
    resave:false,
    saveUninitialized: true,
  },
  mongodb: 'mongodb://localhost:27017/blog'
};
