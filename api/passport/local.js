'use strict'

/**
 * Module dependencies.
 */

const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy
const User = mongoose.model('User')

/**
 * Expose
 */

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    const options = {
      criteria: {email: email},
      select: '_id name email hashed_password salt permissions'
    }
    User.load(options, function (err, user) {
      console.log('根据邮箱获取账号')
      if (err) return done(err)
      if (!user) {
        console.log('没有该用户')
        return done(null, false, {message: 'Unknown user'})
      }
      if (!user.authenticate(password)) {
        console.log('密码错误')
        return done(null, false, {message: 'Invalid password'})
      }
      return done(null, user)
    })
  }
)
