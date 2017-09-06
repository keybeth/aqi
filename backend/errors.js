exports.getError =  function (id){
	return jsonErrors[id];
}

exports.type =  {
    UNKNOWN_SERVER : 0,
    AQI_FAILED : 1
};

var jsonErrors = [
	{
		code : 1,
		message : "Internal server error"
	},
	{
		code : 2,
		message : "Error to request in AQI API"
	}
]