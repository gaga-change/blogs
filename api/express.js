'use strict'

/**
 * Module dependencies.
 */

const express = require('express')
const session = require('express-session')
const compression = require('compression')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const csrf = require('csurf')
const cors = require('cors')
const mongoStore = require('connect-mongo')(session)
const winston = require('winston')
// const config = require('./');
const pkg = require('../package.json')

const env = process.env.NODE_ENV || 'development'

/**
 * Expose
 */

module.exports = function (app, passport) {
  // Compression middleware (should be placed before express.static)
  app.use(compression({
    threshold: 512
  }))

  // Use winston on production
  let log = 'dev'
  if (env !== 'development') {
    log = {
      stream: {
        write: message => winston.info(message)
      }
    }
  }

  // Don't log during tests
  // Logging middleware
  if (env !== 'test') app.use(morgan(log))

  // expose package.json to views
  // app.use(function (req, res, next) {
  //   res.locals.pkg = pkg
  //   // res.locals.env = env;
  //   next()
  // })

  // bodyParser should be above methodOverride
  // app.use(bodyParser.json())
  // app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json({limit: '50mb'}))
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
  // app.use(bodyParser({uploadDir: './tmp'}))

  // app.use(methodOverride(function (req) {
  //   if (req.body && typeof req.body === 'object' && '_method' in req.body) {
  //     // look in urlencoded POST bodies and delete it
  //     var method = req.body._method;
  //     delete req.body._method;
  //     return method;
  //   }
  // }));

  // CookieParser should be above session
  app.use(cookieParser())
  app.use(cookieSession({secret: 'secret', maxAge: 10 * 24 * 60 * 60 * 1000}))
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: pkg.name,
    store: new mongoStore({
      url: 'mongodb://localhost/test',
      collection: 'sessions'
    })
  }))

  // use passport session
  app.use(passport.initialize())
  app.use(passport.session())

  // connect flash for flash messages - should be declared after sessions
  // app.use(flash())

  // should be declared after session and flash
  // app.use(helpers(pkg.name))

  if (false) {
    app.use(csrf())

    // This could be moved to view-helpers :-)
    app.use(function (req, res, next) {
      res.locals.csrf_token = req.csrfToken()
      next()
    })
  }

  if (env === 'development') {
    app.locals.pretty = true
  }
}
