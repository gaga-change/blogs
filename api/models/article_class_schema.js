/**
 * Created by 严俊东 on 2017/4/26.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * 文档类别
 */
const ArticleClassSchema = new Schema({
  name: {type: String, default: ''},
  articleMenu: {type: Schema.ObjectId, ref: 'ArticleMenu'},
  createDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now}
})

ArticleClassSchema.path('name').validate(function (name, fn) {
  const ArticleClass = mongoose.model('ArticleClass')
  if (this.isNew || this.isModified('name')) {
    ArticleClass.find({name: name}).exec(function (err, articleClass) {
      fn(!err && articleClass.length === 0)
    })
  } else fn(true)
}, '用户名已存在！')

ArticleClassSchema.statics = {
  /**
   * Find ArticleClass by id
   *
   * @param {ObjectId} id
   * @api private
   */
  load: function (_id) {
    return this.findOne({_id})
    .populate('articleMenu', 'name')
    .exec()
  },
  /**
   * List articles
   *
   * @param {Object} options
   * @api private
   */
  list: function (options) {
    const criteria = options.criteria || {}
    const page = options.page || 0
    const limit = options.limit || 30
    return this.find(criteria)
    .populate('articleMenu', 'name')
    .sort({createdAt: -1})
    .limit(limit)
    .skip(limit * page)
    .exec()
  }
}

mongoose.model('ArticleClass', ArticleClassSchema)
