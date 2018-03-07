/**
* @memberof app
* @name AqiService
* @ngdoc service
*
* @param  {service} 	$http 		Angular http service
* @param  {constant} 	CONSTANTS	Constants defined in the application before bootstrapping
*
* @description 
*    Angular Service to request to AQI endpoints from the API.
*/
angular
    .module('app')
	.factory('AqiService', AqiService);

AqiService.$inject = ['$http','CONSTANTS'];
	
function AqiService($http, CONSTANTS) {
	
	return {
		getAqiByCity: getAqiByCity
	};
	
	/**
     * @function getAqiByCity
     *
     * @memberof AqiService
     *
     * @param  {string} city The city's name to search
     *
     * @description 
     *    Get the AQI value from API.
     *
     * @return {object} Data from API to the city
     *
     */	
	function getAqiByCity(city){	
		return $http.get(CONSTANTS.API_URL+'/'+CONSTANTS.VERSION+'/aqi/city/'+encodeURIComponent(city)).then(function(response){
			return response.data;
		});
	};
}
