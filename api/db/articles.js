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
 */

exports.create = async(function* (req, res) {
  const article = new Article(req.body)
  article.articleClass = req.articleClass
  article.articleMenu = req.articleClass.articleMenu
  try {
    yield article.uploadAndSave()
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
  assign(article, req.body)
  article.articleClass = req.articleClass
  article.updateDate = Date.now()
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
  const title = req.query.title
  const articleClassId = req.query.articleClassId
  const articleMenuId = req.query.articleMenuId
  const push = req.query.push
  const hot = req.query.hot
  let limit = Number(req.query.limit)
  const options = {
    limit: limit,
    page: page
  }
  options.criteria = {}
  options.sort = {createDate: -1} // 默认根据时间排序
  if (_id) options.criteria._id = _id
  if (title) options.criteria.title = new RegExp('(' + title + ')', 'i')
  if (articleClassId) options.criteria.articleClass = articleClassId
  if (articleMenuId) options.criteria.articleMenu = articleMenuId
  if (push) options.criteria.push = push
  if (hot) {
    if (Number(hot) === -1)
      options.sort = {clickNum: -1}
    else {
      options.sort = {clickNum: 1}
    }
  } // 根据点击量排序
  const articles = yield Article.list(options)
  if (_id) { // 如果是查询某一个文章，则直接访问量添 1
    let article = articles[0]
    article.clickNum = article.clickNum + 1
    article.save()
  }
  const count = yield Article.count(options.criteria)
  res.json({
    title: 'Articles',
    success: true,
    articles: articles,
    page: page + 1,
    count: count,
    pages: Math.ceil(count / limit)
  })
})
