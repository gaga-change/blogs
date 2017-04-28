/**
 * Created by 严俊东 on 2017/4/27.
 */

require('../models/user_schema')
const mongoose = require('mongoose')
const {wrap: async} = require('co')
const only = require('only')
const User = mongoose.model('User')
const assign = Object.assign

/**
 * 根据 param中的ID，获取用户信息，并保存在req中
 */

exports.load = async(function* (req, res, next, _id) {
  const criteria = {_id}
  try {
    req.profile = yield User.load({criteria})
    if (!req.profile) return next(new Error('User not found'))
  } catch (err) {
    return next(err)
  }
  next()
})

/**
 * 增
 */

exports.create = async(function* (req, res) {
  const user = new User(req.body)
  user.provider = 'local'
  try {
    yield user.save()
    console.log(req.logIn)
    req.logIn(user, err => {
      if (err) req.flash('info', 'Sorry! We are not able to log you in!')
      // return res.redirect('/');
      res.json({success: true})
    })
  } catch (err) {
    const errors = Object.keys(err.errors)
    .map(field => err.errors[field].message)
    res.json({success: false, errors})
  }
})

/**
 *  查 看个人信息（根据进入的id）
 */

exports.show = function (req, res) {
  const user = req.profile
  res.json({
    success: true,
    data: user
  })
}

/**
 * Logout  退出
 */

exports.logout = function (req, res) {
  req.logout()
  res.json({success: true})
}

/**
 * Session
 */

exports.session = login

/**
 * Login 登入
 */

function login (req, res) {
  // 用于保留当前的浏览位置，登入结束后返回相应位置
  const redirectTo = req.session.returnTo
    ? req.session.returnTo
    : '/'
  delete req.session.returnTo
  // res.redirect(redirectTo);
}
