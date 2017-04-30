'use strict'

/**
 * 模块依赖
 */

const mongoose = require('mongoose')
const crypto = require('crypto')

const Schema = mongoose.Schema
const oAuthTypes = [
  // 'github',
]
const PERMISSIONS = {
  _MASTER: 1,
  _COMMON: 2
}
/**
 * User Schema
 */

const UserSchema = new Schema({
  name: {type: String, default: ''},
  email: {type: String, default: ''},
  provider: {type: String, default: ''},
  hashed_password: {type: String, default: ''},
  salt: {type: String, default: ''},
  permissions: {type: Number, default: PERMISSIONS._COMMON},
  github: {}
})

// 验证是否存在
const validatePresenceOf = value => value && value.length

/**
 * 虚拟属性 Virtuals   password
 */

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

UserSchema
  .virtual('isMaster')
  .get(function () {
    console.log(this.permissions, this.permissions === PERMISSIONS._MASTER)
    return (this.permissions === PERMISSIONS._MASTER ? true : null)
  })

/**
 * Validations
 * 验证
 */
// 5个基本验证
//  - 用户名验证 空
//  - 邮箱验证 空
//  - 邮箱验证 已存在
//  - 密码hashed_password 空

UserSchema.path('name').validate(function (name) {
  if (this.skipValidation()) return true
  return name.length
}, 'Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  if (this.skipValidation()) return true
  return email.length
}, 'Email cannot be blank')

UserSchema.path('email').validate(function (email, fn) {
  const User = mongoose.model('User')
  if (this.skipValidation()) fn(true)

  // Check only when it is a new user or when email field is modified
  // 验证 邮箱修改或创建账号时 是否已经存在
  if (this.isNew || this.isModified('email')) {
    User.find({email: email}).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (this.skipValidation()) return true
  return hashed_password.length && this._password.length
}, 'Password cannot be blank')

/**
 * Pre-save hook。 用户保存的钩子。 检测虚拟属性 password 是否为空
 */

UserSchema.pre('save', function (next) {

  if (!this.isNew) return next()
  // 如果是新创建用户
  // 如果密码不存在 且不是 第三方。报错
  if (!validatePresenceOf(this.password) && !this.skipValidation()) {
    next(new Error('Invalid password'))
  } else {
    next()
  }
})

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * 验证 - 检测密码是否正确
   *
   * @param {String} 普通的文本（明文）
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  /**
   * 创建 salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * 加密 password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },

  /**
   * Validation is not required if using OAuth
   * 如果是第三方登入，返回true
   */

  skipValidation: function () {
    return ~oAuthTypes.indexOf(this.provider)
  }
}

/**
 * Statics
 */

UserSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name email _id isMaster permissions'
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb)
  }
}

mongoose.model('User', UserSchema)
