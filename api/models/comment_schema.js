/**
 * Created by 严俊东 on 2017/5/4.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: { type : String, default : '', trim : true },
  user: { type : Schema.ObjectId, ref : 'User' },
  article: { type : Schema.ObjectId, ref : 'Article' },
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createDate: { type : Date, default : Date.now },
    updateDate: { type : Date, default : Date.now }
  }],
  createDate  : { type : Date, default : Date.now },
  updateDate: { type : Date, default : Date.now }
});

/**
 * Validations
 */

CommentSchema.path('body').required(true, '内容不能为空');


/**
 * 实例方法
 */

CommentSchema.methods = {
  /**
   * 添加子评论
   *
   * @param {User} user
   * @param {Object} comment
   * @api private
   */

  addComment: function (user, comment) {
    this.comments.push({
      body: comment.body,
      user: user._id
    });
    return this.save();
  },

  /**
   * 移除子评论
   *
   * @param {commentId} String
   * @api private
   */

  removeComment: function (commentId) {
    const index = this.comments
    .map(comment => comment.id)
    .indexOf(commentId);
    if (~index) this.comments.splice(index, 1);
    // else throw new Error('评论没有找到');
    return this.save();
  }
};

/**
 * 静态方法
 */

CommentSchema.statics = {

  /**
   * 根据id获取评论
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (_id) {
    return this.findOne({ _id })
    .populate('user', 'name email _id isMaster')
    .populate('comments.user')
    .exec();
  },

  /**
   * 获取第一层评论列表
   *
   * @param {Object} options
   * @api private
   */

  list: function (options, options_son) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
    .populate('user', 'name email _id isMaster')
    .populate('comments.user', 'name email _id isMaster')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * page)
    .exec();
  }
};

mongoose.model('Comment', CommentSchema);
