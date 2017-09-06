angular
    .module('app')
	.filter('camelToCapitalize', camelToCapitalize);

camelToCapitalize.$inject = [];

function camelToCapitalize	() {
	return function(text) {
		return text.split(/-/).map(function(p) {
	        return p.charAt(0).toUpperCase() + p.slice(1);
	    }).join(' ');
    }
}
