var router = require('express').Router()
let articleMenu = require('./db/articleMenu')
let articleClass = require('./db/articleClass')

router.param('articleMenuId', articleMenu.load)
router.param('articleClassId', articleClass.load)

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
module.exports = router
