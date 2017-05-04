/**
 * Created by 严俊东 on 2017/5/4.
 */
/**
 * 碎言碎语 接口实现
 */
require('../models/spoken_schema')
const mongoose = require('mongoose')
const {wrap: async} = require('co')
const only = require('only')
const Spoken = mongoose.model('Spoken')
const assign = Object.assign

/**
 * 根据id找到相应文章，并添加到 req
 */

exports.load = async(function* (req, res, next, id) {
  try {
    req.spoken = yield Spoken.load(id)
    if (!req.spoken) {
      res.json({success: false, errors: ['Spoken 没有该ID']})
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
  const spoken = new Spoken(req.body)
  try {
    yield spoken.save()
    res.json({
      success: true,
      msg: 'Spoken 添加成功'
    })
  } catch (err) {
    const errors = Object.keys(err.errors)
    .map(field => err.errors[field].message)
    res.json({
      success: false,
      msg: 'Spoken 服务器繁忙，添加失败',
      errors
    })
  }
})

/**
 * 删 根据id删除
 */

exports.destroy = async(function* (req, res) {
  yield req.spoken.remove()
  res.json({success: true, msg: 'Spoken 文章删除成功'})
})

/**
 * 改 修改
 */

exports.update = async(function* (req, res) {
  const spoken = req.spoken
  assign(spoken, req.body)
  spoken.updateDate = Date.now()
  try {
    yield spoken.save()
    res.json({success: true, msg: 'Spoken 文章修改成功'})
  } catch (err) {
    const errors = Object.keys(err.errors)
    .map(field => err.errors[field].message)
    res.json({success: false, msg: 'Spoken 文章修改失败', errors, spoken})
  }
})

/**
 * 查 获取列表
 */

exports.index = async(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1
  const _id = req.query.item
  const intro = req.query.intro
  let limit = Number(req.query.limit) || 30
  const options = {
    limit: limit,
    page: page
  }
  options.criteria = {}
  if (_id) options.criteria._id = _id
  if (intro) options.criteria.intro = new RegExp('(' + intro + ')', 'i')
  const spokens = yield Spoken.list(options)
  const count = yield Spoken.count(options.criteria)
  res.json({
    success: true,
    data: spokens,
    page: page + 1,
    count: count,
    pages: Math.ceil(count / limit)
  })
})
