var express = require('express');
var path = require('path');
var config = require('./config');
var compression = require('compression');

var app = express();
var http = require('http');

// Configuration
app.use(compression());
app.use(express.static(path.join(config.root, 'public')));
app.set('appPath', path.join(config.root, 'public'));

// Routes
require('./routes')(app);

// Start server
http.createServer(app).listen(config.port, function () {
  console.log('Front listening on %d, in %s mode', config.port, app.get('env'));
});

exports = module.exports = app;