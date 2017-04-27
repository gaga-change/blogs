const Nuxt = require('nuxt')
const app = require('express')()
const mongoose = require('mongoose')

var bodyParser = require('body-parser')
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

// Import API Routes
app.use('/api', require('./api/index'))

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
  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}
// Listen the server

function connect () {
  var options = {server: {socketOptions: {keepAlive: 1}}}
  return mongoose.connect('mongodb://localhost/test', options).connection
}
