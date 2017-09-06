angular
    .module('app')
	.factory('AqiService', AqiService);

AqiService.$inject = ['$http','CONSTANTS'];
	
function AqiService($http, CONSTANTS) {
	
	return {
		getAqiByCity: getAqiByCity
	};
	
	function getAqiByCity(city){	
		return $http.get(CONSTANTS.API_URL+'/'+CONSTANTS.VERSION+'/aqi/city/'+encodeURIComponent(city)).then(function(response){
			return response.data;
		});
	};
}
