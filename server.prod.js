'use strict';

var Nuxt = require('nuxt');
var app = require('express')();
var mongoose = require('mongoose');
var passport = require('passport');
var multer = require('multer');
var upload = multer();
var host = process.env.HOST || '192.168.40.85';
var port = process.env.PORT || 3000;

app.set('port', port);
app.use(upload.single('image'));
require('./api/passport')(passport);
require('./api/express')(app, passport);
require('./api/index')(app, passport);

// Import and Set Nuxt.js options
var config = require('./nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

// Init Nuxt.js
var nuxt = new Nuxt(config);
app.use(nuxt.render);

// Build only in dev mode
if (config.dev) {
  nuxt.build().catch(function (error) {
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  });
}
connect().on('error', console.log).on('disconnected', connect).once('open', listen);
function listen() {
  app.listen(port);
  console.log('Server listening on ' + host + ':' + port); // eslint-disable-line no-console
}
// Listen the server

function connect() {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect('mongodb://localhost/test', options).connection;
}
