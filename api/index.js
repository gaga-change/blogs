let articleMenu = require('./db/articleMenu')
let articleClass = require('./db/articleClass')
var router = require('express').Router()
let users = require('./db/user')
const auth = require('./middlewares/authorization')
const only = require('only')

// 判断是否登入 以及 是否有最高权限
const authMaster = [auth.requiresLogin, auth.requireMaster]
// const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

module.exports = function (app, passport) {
  passport.authenticate.bind(passport)
  router.param('articleMenuId', articleMenu.load)
  router.param('articleClassId', articleClass.load)
  router.param('userId', users.load)

// 账号 退出-登入-注册
  router.get('/logout', users.logout) // 退出
  router.post('/users', users.create) // 注册
  router.post('/users/session', function (req, res, next) { // 登入
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        console.log('第一层错误')
        return res.json({success: false})
      }
      if (!user) {
        console.log('第二层错误')
        return res.json({success: false})
      }
      req.logIn(user, function (err) {
        if (err) {
          console.log('logIn 错误')
          return res.json({success: false})
        }
        return res.json({success: true, msg: '登入成功', user: only(user, '_id name email isMaster')})
      })
    })(req, res, next)
  })  // 登入
// 账号管理  增-删-改-查
  router.post('/users/add', users.add) // 增
  router.delete('/users/:userId', users.destroy) // 删除
  router.put('/users/:userId', users.update)  // 改
  router.get('/users', users.index) // 账号信息

// 文章类型（分类管理）
  router.post('/article/menu', authMaster, articleMenu.create)
  router.delete('/article/menu/:articleMenuId', authMaster, articleMenu.destroy)
  router.put('/article/menu/:articleMenuId', authMaster, articleMenu.update)
  router.get('/article/menu/:articleMenuId', articleMenu.show)
  router.get('/article/menu', articleMenu.index)

// 文章类别（细分）
  router.post('/article/class/:articleMenuId', authMaster, articleClass.create)
  router.delete('/article/class/:articleClassId', authMaster, articleClass.destroy)
  router.put('/article/class/:articleMenuId/:articleClassId', authMaster, articleClass.update)
  router.get('/article/class/:articleClassId', articleClass.show)
  router.get('/article/class', articleClass.index)
  app.use('/api', router)
}
