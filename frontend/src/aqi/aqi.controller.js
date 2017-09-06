angular
    .module('app')
	.controller('AqiController', AqiController);

AqiController.$inject = ['$log','NgMap', 'AqiService','camelToCapitalizeFilter'];

function AqiController($log,NgMap, AqiService, camelToCapitalizeFilter) {
	
	var vm = this;
	vm.center;
	vm.position;
	vm.show;
	vm.airPollutionLevel;
	vm.error;
	
	vm.$onInit = function(){
		vm.center = [-33.4378305,-70.65044920000003]; //Santiago, Chile
		vm.show = false;
	};
	
	vm.onPlaceChange = function(event){
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
	
	vm.showMarker = function(){
		vm.show = true;
	};
	
	vm.closeMarker = function(){
		vm.show = false;
	};

	vm.capitalizeAPL = function () {
		return vm.airPollutionLevel ? camelToCapitalizeFilter(vm.airPollutionLevel): null;
	}

	function initMarker () {
        vm.closeMarker();
        vm.city = null;
		vm.position = null;
        vm.error = null;
        vm.aqi = null;
        vm.airPollutionLevel = null;
	}
}
