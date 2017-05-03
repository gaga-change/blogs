const mongoose = require('mongoose')
// const notify = require('../mailer')

// const Imager = require('imager')
// const imagerConfig = require('../imager')

const Schema = mongoose.Schema

const getTags = tags => tags.join(',')
const setTags = tags => tags.split(',')

/**
 * Article Schema
 */

const ArticleSchema = new Schema({
  title: {type: String, default: '', trim: true},
  body: {type: String, default: '', trim: true},
  user: {type: Schema.ObjectId, ref: 'User'},
  comments: [{
    body: {type: String, default: ''},
    user: {type: Schema.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now}
  }],
  tags: {type: [], get: getTags, set: setTags},
  image: {
    cdnUri: String,
    files: []
  },
  createdAt: {type: Date, default: Date.now}
})

/**
 * Validations 验证
 */

ArticleSchema.path('title').required(true, '标题不能为空')
ArticleSchema.path('body').required(true, '内容不能为空')

/**
 * Pre-remove hook  删除的钩子
 */

ArticleSchema.pre('remove', function (next) {
  // const imager = new Imager(imagerConfig, 'S3');
  // const files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  // imager.remove(files, function (err) {
  //   if (err) return next(err);
  // }, 'article');

  next()
})

/**
 * Methods
 */

ArticleSchema.methods = {

  /**
   * Save article and upload image
   * 保存文章并更新图片
   *
   * @param {Object} images
   * @api private
   */

  uploadAndSave: function (images) {
    const err = this.validateSync()
    if (err && err.toString()) throw new Error(err.toString())
    // return this.save()
    console.log(images)
    if (!images) {
      return this.save()
    }
    console.log('err1')
    const imager = new Imager(imagerConfig, 'S3')
    const self = this
    console.log('err2')
    imager.upload(images, function (err, cdnUri, files) {
      console.log('err3')
      if (err) return err
      console.log('err4', cdnUri, files)
      if (files.length) {
        self.image = {cdnUri: cdnUri, files: files}
      }
      self.save()
    }, 'article')

  },

  /**
   * 添加评论
   *
   * @param {User} user
   * @param {Object} comment
   * @api private
   */

  addComment: function (user, comment) {
    this.comments.push({
      body: comment.body,
      user: user._id
    })

    // if (!this.user.email) this.user.email = 'email@product.com'

    // notify.comment({
    //   article: this,
    //   currentUser: user,
    //   comment: comment.body
    // })

    return this.save()
  },

  /**
   * 删除评论
   *
   * @param {commentId} String
   * @api private
   */

  removeComment: function (commentId) {
    const index = this.comments
      .map(comment => comment.id)
      .indexOf(commentId)

    if (~index) this.comments.splice(index, 1)
    else throw new Error('Comment not found')
    return this.save()
  }
}

/**
 * Statics
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
      .populate('user', 'name email username')
      .populate('comments.user')
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
    return this.find(criteria)
      .populate('user', 'name username')
      .sort({createdAt: -1})
      .limit(limit)
      .skip(limit * page)
      .exec()
  }
}

mongoose.model('Article', ArticleSchema)
