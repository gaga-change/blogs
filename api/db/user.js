/**
 * Created by 严俊东 on 2017/4/27.
 */

require('../models/user_schema')
const mongoose = require('mongoose')
const {wrap: async} = require('co')
const only = require('only')
const User = mongoose.model('User')
const assign = Object.assign
const PERMISSIONS = {
  _MASTER: 1,
  _COMMON: 2
}
/**
 * 根据 param中的ID，获取用户信息，并保存在req中
 */

exports.load = async(function* (req, res, next, _id) {
  const criteria = {_id}
  try {
    req.profile = yield User.load({criteria})
    if (!req.profile) {
      res.json({
        msg: '没有该UserId',
        success: false
      })
    }
  } catch (err) {
    res.json({
      msg: 'User 系统繁忙',
      success: false
    })
  }
  next()
})

/**
 * 注册（自动登入，保存session）
 */

exports.create = async(function* (req, res) {
  const user = new User(only(req.body, 'name email password'))
  user.provider = 'local'
  try {
    yield user.save()
    req.logIn(user, err => {
      if (err) req.flash('info', 'Sorry! We are not able to log you in!')
      res.json({success: true, user: only(req.user, 'name email _id isMaster')})
    })
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message)
    res.json({success: false, errors})
  }
})

/**
 * Logout  退出
 */

exports.logout = function (req, res) {
  req.logout()
  res.json({success: true})
}

/**
 * 增 添加用户,不登入
 */
exports.add = async(function* (req, res) {
  const user = new User(only(req.body, 'name email password'))
  user.provider = 'local'
  try {
    yield user.save()
    res.json({success: true, msg: '添加成功', user: only(user, 'name email _id permissions createDate updateDate')})
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message)
    res.json({success: false, errors})
  }
})

/**
 * 删 删除用户，需传入id
 */
exports.destroy = async(function* (req, res) {
  if (req.profile.permissions === PERMISSIONS._MASTER) {
    res.json({success: false, msg: '管理员用户不能删除'})
  } else {
    yield req.profile.remove()
    res.json({success: true})
  }

})

/**
 * 改 修改用户信息，需传入id
 */
exports.update = async(function* (req, res) {
  const user = req.profile
  assign(user, only(req.body, 'name email password'))
  user.updateDate = Date.now()
  try {
    yield user.save()
    res.json({success: true, msg: 'user 更新成功'})
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message)
    res.json({success: false, msg: 'user 数据更新异常', errors})
  }
})

/**
 * 查 查询列表
 * 可带参数
 *  item(_id) 全匹配
 *  email 模糊
 *  name 模糊
 */

exports.index = async(function* (req, res) {
  const page = (Number(req.query.page) > 0 ? Number(req.query.page) : 1) - 1
  const _id = req.query.item
  const email = req.query.email
  const name = req.query.name
  const limit = Number(req.query.limit)
  // 如果没有limit，直接返回全部列表
  try {
    const options = {
      limit: limit,
      page: page,
      select: 'name email _id permissions createDate updateDate'
    }
    options.criteria = {}
    if (_id) options.criteria._id = _id
    if (email) options.criteria.email = new RegExp('(' + email + ')', 'i')
    if (name) options.criteria.name = new RegExp('(' + name + ')', 'i')
    const user = yield User.list(options)
    const count = yield User.count(options.criteria)
    res.json({
      data: user,
      page: page + 1,
      pages: Math.ceil(count / limit),
      count: count,
      success: true
    })
  } catch (err) {
    res.json({success: false, msg: 'User 获取列表失败'})
  }
})
