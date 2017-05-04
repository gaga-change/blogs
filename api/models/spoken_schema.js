/**
 * Created by 严俊东 on 2017/5/4.
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Spoken Schema
 */
const SpokenSchema = new Schema({
  intro: {type: String, default: '', trim: true},
  imageUrl: {type: String, default: ''},
  createDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now}
})

/**
 * 静态方法
 */

SpokenSchema.statics = {

  /**
   * 通过id找到相应文章
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (_id) {
    return this.findOne({_id})
    .exec()
  },

  /**
   * 查询列表列表
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
      .sort({createdAt: -1})
      .limit(limit)
      .skip(limit * page)
      .exec()
    } else {
      return this.find(criteria)
      .sort({createdAt: -1})
      .limit(limit)
      .skip(limit * page)
      .exec()
    }
  }
}

mongoose.model('Spoken', SpokenSchema)
