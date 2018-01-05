/**
 * @Author: 魏巍
 * @Date:   2017-12-03T12:17:55+08:00
 * @Email:  jswei30@gmail.com
 * @Filename: article.js
 * @Last modified by:   魏巍
 * @Last modified time: 2017-12-31T00:37:14+08:00
 */
var mongoose = require('./db'),
  Colunm = require('../model/colunm'),
  helper = require('../model/helper');

var ArticleSchema = new mongoose.Schema({
  fid: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: '官方发布'
  },
  title: {
    type: String,
    required: [true, '请填写栏目标题']
  },
  keywords: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  sorts: {
    type: Number,
    default: 100
  },
  com: {
    type: Boolean,
    default: false
  },
  new: {
    type: Boolean,
    default: false
  },
  hot: {
    type: Boolean,
    default: false
  },
  head: {
    type: Boolean,
    default: false
  },
  top: {
    type: Boolean,
    default: false
  },
  img: {
    type: Boolean,
    default: false
  },
  hits: {
    type: Number,
    default: 0
  },
  status: {
    type: Boolean,
    default: false
  },
  recover: {
    type: Boolean,
    default: false
  },
  rdate: {
    type: String,
    default: Date.now()
  },
  date: {
    type: String,
    default: Date.now()
  }
}, {
  versionKey: false
});

ArticleSchema.statics.updateAll = (condition, update, callback) => {
  mongoose.model('Article').updateMany(condition, update, (e, r) => {
    if (e) {
      callback(e, null);
    } else {
      callback(null, r);
    }
  });
};

ArticleSchema.statics.getListWithColunmId = (condition, callback) => {
  if (condition.name == 0) {
    callback(null, null);
    return;
  }
  mongoose.model('Colunm').findOne(condition, "_id", (e, r) => {
    if (e) callback(e, null);
    mongoose.model('Article').find({
      fid: r._id,
      status: false
    }, '_id title keywords description', (e1, r1) => {
      if (e1) {
        callback(e1, null);
        return;
      } else {
        callback(null, r1);
        return;
      }
    }).sort({
      sorts: 1,
      date: -1
    });
  });
};


ArticleSchema.statics.getArticleSee = (condition, callback) => {
  if (condition._id == 0 || condition._id == undefined) {
    callback('no param _id', null);
    return;
  }
  Article.update(condition, {
    $inc: {
      hits: 1
    }
  }, (eu, ru) => {
    if (eu) {
      callback(eu, null, null, null);
      return;
    }
  });
  Article.findOne(condition, (e, art) => {
    if (e) {
      callback(e, null, null, null);
      return;
    }
    art.content = helper.decodeHtml(art.content);
    Article.findOne({
      _id: {
        $lt: art._id
      },
      status: false
    }, (e1, pre) => {
      if (e1) {
        callback(e1, null, null, null);
        return;
      }
      Article.findOne({
        _id: {
          $gt: art._id
        },
        status: false
      }, (e2, nex) => {
        if (e2) {
          callback(e1, null, null, null);
          return;
        }
        callback(null, art, pre, nex);
      }).limit(1).sort({
        _id: 1
      });
    }).limit(1).sort({
      _id: -1
    });
  });
}

ArticleSchema.statics.findOneWithColunms = (condition, callback, condition1) => {
  if (condition._id == 0) {
    mongoose.model('Colunm').find(condition1, "_id title fid", (e, r1) => {
      if (e) callback(e, null, null);
      var model = new Article();
      model._id = null;
      callback(null, model, helper.sonsTree(r1));
    });
  } else {
    mongoose.model('Article').findOne(condition, (e, r) => {
      if (e) {
        callback(e, null, null);
      } else {
        if (r) {
          mongoose.model('Colunm').find(condition1, "_id title fid", (e, r1) => {
            if (e) callback(e, null, null);
            callback(null, r, helper.sonsTree(r1));
          });
        }
      }
    });
  }
}

ArticleSchema.statics.getArticleRound = (condition, length, callback) => {
  condition = condition || {
    status: false
  };
  Article.count(condition, (e, r) => {
    let total = r,
      promises = [],
      skip = 0,
      arr = [];
    for (let i = 0; i < length; i++) {
      let skip = Math.round(Math.random() * total);
      if (arr.findIndex((v, i) => {
          return v == skip;
        }) > -1) {
        continue;
      } else {
        arr.push(skip);
        promises.push(Article.find(condition, '_id title date hits').skip(skip).limit(1).exec());
      }
    }
    Promise.all(promises).then(function(results) {
      for (i in results) {
        if (results[i][0]) {
          results[i] = results[i][0];
        }
      }
      callback(null, results);
    });
  });
}

module.exports = Article = mongoose.model('Article', ArticleSchema);