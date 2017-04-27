// /**
//  * Created by 严俊东 on 2017/4/24.
//  */

require('../models/article_menu_schema')
const mongoose = require('mongoose')
const {wrap: async} = require('co')
const only = require('only')
const ArticleMenu = mongoose.model('ArticleMenu')
const assign = Object.assign

/**
 * 根据传入的ArticleMenu id值获取 相应的articleMenu
 */
exports.load = async(function* (req, res, next, id) {
  try {
    req.articleMenu = yield ArticleMenu.load(id)
    if (!req.articleMenu) {
      res.json({
        msg: '没有该ArticleMenuID',
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
  const articleMenu = new ArticleMenu(only(req.body, 'name'))
  try {
    yield articleMenu.save()
    res.json({success: true})
  } catch (err) {
    res.json({success: false})
  }
})
/**
 * 删除
 * */
exports.destroy = async(function* (req, res) {
  yield req.articleMenu.remove()
  res.json({success: true})
})

/**
 * 改
 * */
exports.update = async(function* (req, res) {
  const articleMenu = req.articleMenu
  assign(articleMenu, only(req.body, 'name'))
  articleMenu.updateDate = Date.now()
  try {
    // yield ArticleMenu.update({ _id: id }, { $set: { text: 'changed' }}).exec();
    yield articleMenu.save()
    res.json({success: true, msg: 'ArticleMenu 更新成功'})
  } catch (err) {
    const errors = Object.keys(err.errors)
    .map(field => err.errors[field].message)
    res.json({success: false, msg: 'articleMenu 数据更新异常', errors})
  }
})
/**
 * 查 单个
 * */
exports.show = function (req, res) {
  let articleMenu = req.articleMenu
  res.json({data: articleMenu, success: true})
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
      const articleMenus = yield ArticleMenu.find()
      res.json({
        data: articleMenus,
        success: true
      })
    } else { // 有limit，返回 翻页模式的列表
      const options = {
        limit: limit,
        page: page
      }
      if (_id) options.criteria = {_id}
      const articleMenus = yield ArticleMenu.list(options)
      const count = yield ArticleMenu.count()
      res.json({
        data: articleMenus,
        page: page + 1,
        pages: Math.ceil(count / limit),
        success: true
      })
    }
  } catch (err) {
    res.json({success: false, msg: 'ArticleMenu 获取列表失败'})
  }
})

