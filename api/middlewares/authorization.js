'use strict'

/**
 * 1. 需要登入 && 需要高级权限
 * 2. 需要登入 && 需要权限（--- 优化）
 *
 */


/*
 *  需要登入才能操作
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  req.flash('info', 'You are not authorized')
  // res.redirect('/login');
  res.json({success: false, goLogin: true})
}

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/' + req.profile.id)
    }
    next()
  },
  hasRoot: function (req, res, next) {
    if (req.user.permissions.permissions === 1) {

    }
  }
}

/*
 *  Article authorization routing middleware
 */

exports.article = {
  hasAuthorization: function (req, res, next) {
    if (req.article.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/articles/' + req.article.id)
    }
    next()
  }
}

/**
 * Comment authorization routing middleware
 */

exports.comment = {
  hasAuthorization: function (req, res, next) {
    // if the current user is comment owner or article owner
    // give them authority to delete
    if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
      next()
    } else {
      req.flash('info', 'You are not authorized')
      res.redirect('/articles/' + req.article.id)
    }
  }
}
