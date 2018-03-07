/*import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import bootstrap from 'bootstrap';

import angular from 'angular';
import uirouter from 'angular-ui-router';
import ngMap from 'ngMap';
*/
angular
    .module('app', ['ui.router', 'ngMap'])
    .config(config)
	.run(run);


/**
* Init app getting constants from config.json file and manually bootstrapping the module
* @memberof app
* @ngdoc config
* @name init
* @param {object} config 	Application constants.
*/
angular.element(document).ready(
	function init($http) {
		$http.get('config.json').then(function (config) {
			return config;
	    },function (error) {
	        return { 
	        	API_URL: 'http://localhost:4000/api',
				VERSION: 'v1',
				DEBUG: true
			};
	    }).then(function(config) {
		    bootstrapApplication(config);
		});
	}
);

/**
* Bootstrap application setting constants.
* @memberof app
* @ngdoc config
* @name bootstrapApplication
* @param {object} config 	Application constants.
*/
function bootstrapApplication(config) {
	angular.module('app').constant('CONSTANTS', config);
    angular.bootstrap(document, ['app']);
}


/**
* Configures routes and log.
* @memberof app
* @ngdoc config
* @name config
* @param {service} 	$urlRouterProvider 			Watches $location and provides interface to default state
* @param {service} 	$stateProvider 				Provider to configure the application's states.
* @param {service} 	$urlMatcherFactoryProvider 	Configure the url matchers
* @param {service} 	$logProvider 				Provider to configure the log service
* @param {constant} CONSTANTS 					Constants defined in the application before bootstrapping
*/
function config($urlRouterProvider, $stateProvider, $urlMatcherFactoryProvider,$logProvider, CONSTANTS) {

	$logProvider.debugEnabled(CONSTANTS.DEBUG || false);

    $urlRouterProvider.otherwise('/');
	$urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
        .state('app', {
			url: '/',
            views:{
				'@': {
					templateUrl: 'app.view.html'
				},
				'contentView@app': {
					templateUrl: 'aqi/aqi.view.html',
					controller: 'AqiController as ctrl'
				}
			}
        });
}


/**
* Main run configurations
* @memberof app
* @ngdoc config
* @name run
* @param {service} 	$transitions	Angular Router service to manipulate the states transitions
* @param {scope} 	$rootScope 		Application root scope
*/
function run($transitions, $rootScope){
	$transitions.onSuccess( {}, function(trans) {
		$rootScope.state = trans.$to().name;
	});
}
