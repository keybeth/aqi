var express = require('express');
var router = express.Router();
var NodeCache = require( "node-cache" );
var cache = new NodeCache( { stdTTL: 3600, checkperiod: 120 } );
var request = require('request');
var logger = require('./log');

const AQI_TOKEN = 'b7f7fe3119e1c6e2cdfc00bcadf17f5dd6bf2576';

router.get('/api/v1/aqi/city/:city', function(req, res) {
	var city = req.params.city.toLowerCase();
	var key = 'aqi_city_'+city.split(' ').join('_');
	var resp = cache.get( key);
	if(resp !== undefined){
		logger.log('Get from cache key: '+key);
		res.json(resp);
		
	}else{
		var options = {
			url: 'http://api.waqi.info/feed/'+encodeURIComponent(city)+'/?token='+ AQI_TOKEN,
			json: true 
		};
		return request(options, function(error, response, body) {
			logger.log(body);
            if (!error && response.statusCode == 200 && body.status.toLowerCase() == 'ok') {				
				logger.log('Set cache key: '+key);
				cache.set(key,body.data);
				res.json(body.data); 
			}else{
				res.status(404).json(errors.getError(errors.type.AQI_FAILED));
			}
		});
	}	
});

module.exports = router;