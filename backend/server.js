var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var errors = require('./errors');
var routes = require('./routes');
var logger = require('./log');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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
app.use(routes);

var listener = app.listen(7070, function() {
	logger.log('Express Server listening on localhost:7070');
});