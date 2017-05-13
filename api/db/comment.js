/**
 * Created by 严俊东 on 2017/5/4.
 */
/**
 * 评论 接口实现
 */
require('../models/comment_schema')
const mongoose = require('mongoose')
const {wrap: async} = require('co')
const only = require('only')
const Comment = mongoose.model('Comment')
const assign = Object.assign

/**
 * 根据id找到相应评论，并添加到 req
 */

exports.load = async(function* (req, res, next, id) {
  try {
    req.comment = yield Comment.load(id)
    if (!req.comment) {
      res.json({success: false, errors: ['Comment 没有该ID']})
    } else {
      next()
    }
  } catch (err) {
    res.json({success: false, errors: ['服务器繁忙请重试']})
  }
})

/**
 * 增
 */

exports.create = async(function* (req, res) {
  const comment = new Comment(only(req.body, 'body'))
  comment.article = req.article
  comment.user = req.user
  try {
    yield comment.save()
    res.json({
      success: true,
      msg: 'Comment 添加成功'
    })
  } catch (err) {
    const errors = Object.keys(err.errors)
    .map(field => err.errors[field].message)
    res.json({
      success: false,
      msg: 'Comment 服务器繁忙，添加失败',
      errors
    })
  }
})

/**
 * 删 根据id删除
 */

exports.destroy = async(function* (req, res) {
  yield req.comment.remove()
  res.json({success: true, msg: 'Comment 评论删除成功'})
})

/**
 * 改 修改
 */

exports.update = async(function* (req, res) {
  const comment = req.comment
  assign(comment, only(req.body, 'body'))
  comment.updateDate = Date.now()
  try {
    yield comment.save()
    res.json({success: true, msg: 'Comment 评论修改成功'})
  } catch (err) {
    const errors = Object.keys(err.errors)
    .map(field => err.errors[field].message)
    res.json({success: false, msg: 'Comment 评论修改失败', errors, comment})
  }
})

/**
 * 查 获取列表
 */

exports.index = async(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1
  const _id = req.query.item
  const articleId = req.query.articleId
  let limit = Number(req.query.limit) || 30
  const options = {
    limit: limit,
    page: page
  }
  options.criteria = {}
  if (_id) options.criteria._id = _id
  if (articleId) options.criteria.article = articleId
  const comments = yield Comment.list(options)
  const count = yield Comment.count(options.criteria)
  res.json({
    success: true,
    data: comments,
    page: page + 1,
    count: count,
    pages: Math.ceil(count / limit)
  })
})
