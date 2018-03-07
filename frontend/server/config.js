var path = require('path');

module.exports = {
  	env: process.env.NODE_ENV || 'development',
   	root: path.normalize(path.join(__dirname, '..')),
   	port: 9000
};