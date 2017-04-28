let articleMenu = require('./db/articleMenu')
let articleClass = require('./db/articleClass')
var router = require('express').Router()
let users = require('./db/user')
const auth = require('./middlewares/authorization')

module.exports = function (app, passport) {
  const pauth = passport.authenticate.bind(passport)

  router.param('articleMenuId', articleMenu.load)
  router.param('articleClassId', articleClass.load)

  // 账号
  router.get('/logout', users.logout) // 退出
  router.get('/user', function (req, res, next) {
    if (req.isAuthenticated()) {
      res.json({success: true, msg: '登入了', user: req.user})
    } else {
      res.json({success: false, msg: '没登入'})
    }
  })
  router.post('/users', users.create)
  router.post('/users/session', function (req, res, next) {
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
        users.session(req, res)
        return res.json({success: true, msg: '登入成功'})
      })
    })(req, res, next)
  })
  router.get('/users/:userId', users.show)

// 文章类型（分类管理）
  router.post('/article/menu', articleMenu.create)
  router.delete('/article/menu/:articleMenuId', articleMenu.destroy)
  router.put('/article/menu/:articleMenuId', articleMenu.update)
  router.get('/article/menu/:articleMenuId', articleMenu.show)
  router.get('/article/menu', articleMenu.index)

// 文章类别（细分）
  router.post('/article/class/:articleMenuId', articleClass.create)
  router.delete('/article/class/:articleClassId', articleClass.destroy)
  router.put('/article/class/:articleMenuId/:articleClassId', articleClass.update)
  router.get('/article/class/:articleClassId', articleClass.show)
  router.get('/article/class', articleClass.index)
  app.use('/api', router)
}