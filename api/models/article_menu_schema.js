/**
 * Created by 严俊东 on 2017/4/25.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleMenuSchema = new Schema({
  name: {type: String, default: ''},
  createDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now}
})

ArticleMenuSchema.path('name').validate(function (name, fn) {
  const ArticleMenu = mongoose.model('ArticleMenu')
  if (this.isNew || this.isModified('name')) {
    ArticleMenu.find({name: name}).exec(function (err, articleMenu) {
      fn(!err && articleMenu.length === 0)
    })
  } else fn(true)
}, '用户名已存在！')

ArticleMenuSchema.statics = {
  /**
   * Find AtricleMenu by id
   *
   * @param {ObjectId} id
   * @api private
   */
  load: function (_id) {
    return this.findOne({_id})
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
    .sort({createdAt: -1})
    .limit(limit)
    .skip(limit * page)
    .exec()
  }
}

mongoose.model('ArticleMenu', ArticleMenuSchema)
