/** Routes Module
 * @module app
 * @requires express
 * @requires routes/aqi
 */

var express = require('express');
var aqi = require('./api/aqi');

module.exports = function (app) {

	app.use('/api/v1/aqi',aqi);

}