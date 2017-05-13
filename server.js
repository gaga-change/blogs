const Nuxt = require('nuxt')
const app = require('express')()
const mongoose = require('mongoose')
const passport = require('passport')
const multer = require('multer')
const upload = multer()
const host = process.env.HOST || '192.168.40.85'
const port = process.env.PORT || 3000

app.set('port', port)
app.use(upload.single('image'))
require('./api/passport')(passport)
require('./api/express')(app, passport)
require('./api/index')(app, passport)

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)
app.use(nuxt.render)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
  .catch((error) => {
    console.error(error) // eslint-disable-line no-console
    process.exit(1)
  })
}
connect()
.on('error', console.log)
.on('disconnected', connect)
.once('open', listen)
function listen () {
  console.log("连接数据库成功")
  app.listen(port)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}
// Listen the server

function connect () {
  var options = {server: {socketOptions: {keepAlive: 1}}}
  return mongoose.connect('mongodb://localhost/test', options).connection
  // return mongoose.connect('mongodb://127.0.0.1:27017/test', options).connection
}
