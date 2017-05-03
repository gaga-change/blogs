const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Article Schema
 */
const ArticleSchema = new Schema({
  title: {type: String, default: '', trim: true},
  intro: {type: String, default: '', trim: true},
  author: {type: String, default: '', trim: true},
  articleClass: {type: Schema.ObjectId, ref: 'ArticleClass'},
  articleMenu: {type: Schema.ObjectId, ref: 'ArticleMenu'},
  content: {type: String, default: '', trim: true},
  clickNum: {type: Number, default: 0},
  imageUrl: {type: String, default: ''},
  createDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now}
})

/**
 * Validations 验证
 */

// ArticleSchema.path('title').required(true, '标题不能为空')
// ArticleSchema.path('content').required(true, '内容不能为空')

/**
 * 实例方法
 */

ArticleSchema.methods = {
  uploadAndSave: function (images) {
    const err = this.validateSync()
    if (err && err.toString()) throw new Error(err.toString())
    return this.save()
  }
}

/**
 * 静态方法
 */

ArticleSchema.statics = {

  /**
   * 通过id找到相应文章
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (_id) {
    return this.findOne({_id})
      .populate('articleClass', '_id name')
      // .populate('comments.user')
      .exec()
  },

  /**
   * 查询文章列表
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {}
    const page = options.page || 0
    const limit = options.limit || 30
    if (criteria._id) {
      return this.find(criteria)
      .populate('articleClass', '_id name')
      .sort({createdAt: -1})
      .limit(limit)
      .skip(limit * page)
      .exec()
    } else {
      console.log(criteria)
      return this.find(criteria)
      .select('-content')
      .populate('articleClass', '_id name')
      .populate('articleMenu', '_id name')
      .find(criteria)
      .sort({createdAt: -1})
      .limit(limit)
      .skip(limit * page)
      .exec()
    }
  }
}

mongoose.model('Article', ArticleSchema)
