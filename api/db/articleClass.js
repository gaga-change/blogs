/**
 * Created by 严俊东 on 2017/4/26.
 */
require('../models/article_class_schema')
const mongoose = require('mongoose')
const {wrap: async} = require('co')
const only = require('only')
const ArticleClass = mongoose.model('ArticleClass')
const assign = Object.assign
// 文章类别（细分）

/**
 * 根据传入的 ArticleClass id值获取 相应的 articleClass
 */
exports.load = async(function* (req, res, next, id) {
  try {
    req.articleClass = yield ArticleClass.load(id)
    if (!req.articleClass) {
      res.json({
        msg: '没有该 ArticleClass ID',
        success: false
      })
    } else {
      next()
    }
  } catch (err) {
    return next(err)
  }
})

/**
 * 增加
 * */
exports.create = async(function* (req, res) {
  const articleClass = new ArticleClass(only(req.body, 'name'))
  articleClass.articleMenu = req.articleMenu
  try {
    yield articleClass.save()
    res.json({success: true})
  } catch (err) {
    res.json({success: false, msg: '商品类型 ArticleClass 添加失败', errors: [err.toString()]})
  }
})

/**
 * 删除
 * */
exports.destroy = async(function* (req, res) {
  yield req.articleClass.remove()
  res.json({success: true})
})

/**
 * 改
 * */
exports.update = async(function* (req, res) {
  const articleClass = req.articleClass
  assign(articleClass, only(req.body, 'name'))
  articleClass.articleMenu = req.articleMenu
  articleClass.updateDate = Date.now()
  try {
    // yield ArticleClass.update({ _id: id }, { $set: { text: 'changed' }}).exec();
    yield articleClass.save()
    res.json({success: true, msg: 'ArticleClass 更新成功'})
  } catch (err) {
    const errors = Object.keys(err.errors)
    .map(field => err.errors[field].message)
    res.json({success: false, msg: 'articleClass 数据更新异常', errors})
  }
})
/**
 * 查 单个
 * */
exports.show = function (req, res) {
  let articleClass = req.articleClass
  res.json({data: articleClass, success: true})
}
/**
 * 查询列表
 */
exports.index = async(function* (req, res) {
  const page = (Number(req.query.page) > 0 ? Number(req.query.page) : 1) - 1
  const _id = req.query.item
  const limit = Number(req.query.limit)
  // 如果没有limit，直接返回全部列表
  try {
    if (!limit) {
      const articleClass = yield ArticleClass.find().populate('articleMenu', 'name')
      res.json({
        data: articleClass,
        success: true
      })
    } else { // 有limit，返回 翻页模式的列表
      const options = {
        limit: limit,
        page: page
      }
      if (_id) options.criteria = {_id}
      const articleClass = yield ArticleClass.list(options)
      const count = yield ArticleClass.count()
      res.json({
        data: articleClass,
        page: page + 1,
        pages: Math.ceil(count / limit),
        success: true
      })
    }
  } catch (err) {
    res.json({success: false, msg: 'ArticleClass 获取列表失败'})
  }
})
