/** Error Module
 * @module error
 */
module.exports = {
	getError:  function (id){
		return jsonErrors[id];
	},
	type:  {
	    UNKNOWN_SERVER : 0,
	    NOT_FOUND : 1,
	    AQI_FAILED : 2
	}
}

var jsonErrors = [
	{
		code : 1,
		message : "Internal server error"
	},
	{
		code : 2,
		message : "Not found resource"
	},
	{
		code : 3,
		message : "Error to request in AQI API"
	}
]