/**
 * Created by 严俊东 on 2017/5/4.
 */

const {wrap: async} = require('co')
const assign = Object.assign
const only = require('only')

/**
 * 根据子评论的id 得到该子评论
 */
exports.load = function (req, res, next, id) {
  req.commentSon = req.comment.comments.find(commentSon => commentSon.id === id)
  if (!req.commentSon) {
    res.json({success: false, msg: '没有找到该子评论'})
  } else {
    next()
  }
}

/**
 * 增 添加子评论
 */

exports.create = async(function* (req, res) {
  const comment = req.comment
  yield comment.addComment(req.user, req.body)
  res.json({success: true, msg: '添加成功',
    comment: {
      body: req.body.body,
      user: req.user
    }
  })
})

/**
 *  删 删除子评论
 */

exports.destroy = async(function* (req, res) {
  yield req.comment.removeComment(req.params.commentSonId)
  res.json({success: true, msg: '删除成功'})
})

/**
 * 改 修改子评论
 */

exports.update = async(function* (req, res) {
  let commentSon = req.commentSon
  assign(commentSon, only(req.body, 'body'))
  commentSon.updateDate = Date.now()
  console.log(commentSon)
  try {
    req.comment.comments.forEach((v, i) => {
      if (v._id === commentSon._id) {
        req.comment.comments[i].body = commentSon.body
      }
    })
    yield req.comment.save()
    res.json({success: true, msg: 'commentSon 更新成功'})
  } catch (err) {
    const errors = Object.keys(err.errors)
    .map(field => err.errors[field].message)
    res.json({success: false, msg: 'commentSon 数据更新异常', errors})
  }
})
