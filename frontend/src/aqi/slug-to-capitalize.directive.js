/**
* @memberof app
* @name slugToCapitalize
* @ngdoc filter
*
* @param  {string} 	text 	Text to transform by the filter
*
* @description 
*    Transform a slug case string in a capitalize string.
*
* @example
*   Usage:
*
*   <span>{{ 'a-slug-text' | slugToCapitalize }}</span>
*/
angular
    .module('app')
	.filter('slugToCapitalize', slugToCapitalize);

slugToCapitalize.$inject = [];

function slugToCapitalize	() {
	return function(text) {
		return text.split(/-/).map(function(p) {
	        return p.charAt(0).toUpperCase() + p.slice(1);
	    }).join(' ');
    }
}
