const {wrap: async} = require('co')

/**
 * 根据保存在 req中article 以及路径中的评论id准确获取 响应评论
 */

exports.load = function (req, res, next, id) {
  req.comment = req.article.comments
    .find(comment => comment.id === id)
  if (!req.comment) {
    res.json({success: false, msg: 'Comment 没有该id'})
  } else {
    next()
  }
}

/**
 * 创建评论
 */

exports.create = async(function* (req, res) {
  const article = req.article
  try {
    yield article.addComment(req.user, req.body)
    res.json({success: true, msg: '评论添加成功'})
  } catch (err) {
    res.json({success: false, msg: '评论添加失败'})
  }
})

/**
 * 删除评论
 */

exports.destroy = async(function* (req, res) {
  yield req.article.removeComment(req.params.commentId)
  res.json({success: true, msg: '删除评论成功'})
})
