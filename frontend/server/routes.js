var path = require('path');

module.exports = function (app) {

  
  	app.route('/:url(app|assets)/*').get(function (req, res) {
		return res.status(404).json({message: 'not found'});
	});

  	// All routes should redirect to the index.html
  	app.route('/*').get(function (req, res) {
      	res.sendFile(path.join(app.get('appPath'), 'index.html'));
    });
};