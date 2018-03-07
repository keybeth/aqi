/**
* @memberof app
* @name AqiController
* @ngdoc controller
*
* @param  {service} $log 					Angular log service.
* @param  {service} NgMap     				Service that represent the map and its information. 
* @param  {service} AqiService       		Service to request to AQI in the API.
* @param  {filter} 	slugToCapitalizeFilter	Filter to transform slug to capitalize.
*
* @description 
*    Angular Controller to manage aqi page
*
* @attr {array} 	center 		location in latitude and longitude coordinates to center the map
* @attr {array} 	position 	location in latitude and longitude coordinates to put the marker
* @attr {boolean} 	show 		flag o control the hide/show the custom marker
* @attr {string} 	airPollutionLevel 	the air pollution level corresponding to the AQI to the city
* @attr {string} 	error 		error information to show in the view
*/
angular
    .module('app')
	.controller('AqiController', AqiController);

AqiController.$inject = ['$log','NgMap', 'AqiService','slugToCapitalizeFilter'];

function AqiController($log,NgMap, AqiService, slugToCapitalizeFilter) {	

	var vm = this;

	vm.center;
	vm.position;
	vm.show;
	vm.airPollutionLevel;
	vm.error;


	/**
     * @function $onInit
     *
     * @memberof AqiController
     *
     * @description 
     *    Init variables on init page.
     *
     */	
	vm.$onInit = function(){
		vm.center = [-33.4378305,-70.65044920000003]; //Santiago, Chile
		vm.show = false;
	};

	
	/**
     * @function onPlaceChange
     *
     * @memberof AqiController
     *
     * @description 
     *    Take the autocomplete place on every change and get the AQI from the API 
     * and modify the marker information.
     *
     */
	vm.onPlaceChange = function(){
        var place = this.getPlace();
        var loc = place.geometry.location;
        var city;

		place.address_components
		.filter(function (component) {
			return component.types.indexOf('locality') != -1;
		})
		.forEach( function(component, index) {
			city = component.long_name;
		});

		if(city){
			initMarker();
			AqiService.getAqiByCity(city).then(function (response) {
        		vm.city = city;
	        	vm.aqi = response.aqi;
		        if(vm.aqi <= 50 ){
		        	vm.airPollutionLevel = 'good';
		        }else if(vm.aqi <= 100){
		        	vm.airPollutionLevel = 'moderate';
		        }else if(vm.aqi <= 150){
		        	vm.airPollutionLevel = 'little-unhealthy';
		        }else if(vm.aqi <= 200){
		        	vm.airPollutionLevel = 'unhealthy';
		        }else if(vm.aqi <= 300){
		        	vm.airPollutionLevel = 'very-unhealthy';
		        }else {
		        	vm.airPollutionLevel = 'hazardous';
		        }
		        if(response.city.geo.length == 2){
		        	vm.position = [response.city.geo[0], response.city.geo[1]];
		        }else{
		        	vm.position = [loc.lat(), loc.lng()];
		        }		       
		        vm.center = vm.position;
	        })
	        .catch(function (error) {
	        	vm.center = [loc.lat(), loc.lng()];
	        	$log.debug(error);
	        	if(error.data && error.data.message){
	        		vm.error = error.data.message;
	        	}else{
	        		vm.error = 'An error has ocurred';
	        	}
	        });
		}else{
			vm.error = 'You should select a city';
		}
	};

	
	/**
     * @function showMarker
     *
     * @memberof AqiController
     *
     * @description 
     *    Open the custom marker on the map.     *
     */
	vm.showMarker = function(){
		vm.show = true;
	};

	
	/**
     * @function closeMarker
     *
     * @memberof AqiController
     *
     * @description 
     *    Close the custom marker on the map.
     *
     */
	vm.closeMarker = function(){
		vm.show = false;
	};


	/**
     * @function capitalizeAPL
     *
     * @memberof AqiController
     *
     * @description 
     *    Capitalize Air Pollution Level to show in the page.
     *
     */
	vm.capitalizeAPL = function () {
		return vm.airPollutionLevel ? slugToCapitalizeFilter(vm.airPollutionLevel): null;
	}


	function initMarker() {
        vm.closeMarker();
        vm.city = null;
		vm.position = null;
        vm.error = null;
        vm.aqi = null;
        vm.airPollutionLevel = null;
	}
}
