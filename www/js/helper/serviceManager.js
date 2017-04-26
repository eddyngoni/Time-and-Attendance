function CallGetServive($http, ServiceEndPoint, callBack) {
    
	$http({
		method: 'GET',
        cache: false,
        headers: {
            'Cache-Control' : 'no-cache',
            'Content-Type': 'application/json; charset=utf-8'
        },
		url: ServiceEndPoint
	}).then(function successCallBack(response) {
	    
		callBack(response);
	}, function errorCallBack(response) {
	    
		callBack(null);
	});
}

function CallPostServive($http, ServiceEndPoint, callBack) {
	
	$http({
		method: 'POST',
        cache: false,
        headers: {
            'Cache-Control' : 'no-cache',
            'Content-Type': 'application/json; charset=utf-8'
        },
		url: ServiceEndPoint
	}).then(function successCallBack(response) {

		callBack(response);
	}, function errorCallBack(response) {

		callBack(null);
	});
}
