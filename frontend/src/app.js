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



angular.element(document).ready(
	function($http) {
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

function bootstrapApplication(config) {
	angular.module('app').constant('CONSTANTS', config);
    angular.bootstrap(document, ['app']);
}

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

function run($transitions, $rootScope){
	$transitions.onSuccess( {}, function(trans) {
		$rootScope.state = trans.$to().name;
	});
}
