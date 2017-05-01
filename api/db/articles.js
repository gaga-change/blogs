'use strict'

/**
 * Module dependencies.
 */
require('../models/article_schema')
const mongoose = require('mongoose')
const {wrap: async} = require('co')
const only = require('only')
// const {respond, respondOrRedirect} = require('../utils')
const Article = mongoose.model('Article')
const assign = Object.assign

/**
 * 根据id找到相应文章，并添加到 req
 */

exports.load = async(function* (req, res, next, id) {
  try {
    req.article = yield Article.load(id)
    if (!req.article) {
      res.json({success: false, errors: ['Article 没有该ID']})
    } else {
      next()
    }
  } catch (err) {
    res.json({success: false, errors: ['服务器繁忙请重试']})
  }
})

/**
 * 增 文章
 * 上传图片
 */

exports.create = async(function* (req, res) {
  const article = new Article(only(req.body, 'title body tags'))
  article.user = req.user
  try {
    yield article.uploadAndSave(req.file)
    res.json({
      success: true,
      msg: 'Article 添加成功'
    })
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message)
    res.json({
      success: false,
      msg: 'Article 服务器繁忙，添加失败',
      errors
    })
  }
})

/**
 * 删 根据id删除文章
 */

exports.destroy = async(function* (req, res) {
  yield req.article.remove()
  res.json({success: true, msg: 'Article 文章删除成功'})
})

/**
 * 改 修改文章
 */

exports.update = async(function* (req, res) {
  const article = req.article
  assign(article, only(req.body, 'title body tags'))
  try {
    yield article.uploadAndSave(req.file)
    res.json({success: true, msg: 'Article 文章修改成功'})
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message)
    res.json({success: false, msg: 'Article 文章修改失败', errors, article})
  }
})

/**
 * 查 获取文章列表
 */

exports.index = async(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1
  const _id = req.query.item
  const limit = 30
  const options = {
    limit: limit,
    page: page
  }
  if (_id) options.criteria = {_id}
  const articles = yield Article.list(options)
  const count = yield Article.count()
  res.json({
    title: 'Articles',
    success: true,
    articles: articles,
    page: page + 1,
    pages: Math.ceil(count / limit)
  })
})
