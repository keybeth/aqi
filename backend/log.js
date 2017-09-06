var dateFormat = require('dateformat');

exports.log = function (){
	var args = Array.prototype.slice.call(arguments);
	args.unshift(dateFormat(new Date(), 'dd-mm-yyyy HH:MM:ss'));	
	console.log.apply(console,args);
}
