/** 
 * Server API Module
 * @module app
 * @requires express
 * @requires compression 
 * @requires body-parser
 * @requires cors
 * @requires errors
 * @requires routes
 * @requires log
 */

var express = require('express');
var compression = require('compression');
var cors = require('cors');
var bodyParser = require('body-parser');
var errors = require('./errors');
var routes = require('./routes');
var logger = require('./log');


/**
 * Express Application
 */
var app = express();

/**
 * Options to configurate Cross Origin Request
 */
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Exception handler
app.use(function(err, req, res, next) {
	if (req.xhr) {
		res.status(500).json(errors.getError(errors.type.UNKNOWN_SERVER));
	} else {
		res.status(500);
		res.render('error', { error: err });
	}
});

//Routes
routes(app);

app.get('*', function(req, res){
	res.status(404).json(errors.getError(errors.type.NOT_FOUND));
});

/**
 * Http server listener
 */
var listener = app.listen(7070, function() {
	logger.log('Express Server listening on localhost:7070');
});