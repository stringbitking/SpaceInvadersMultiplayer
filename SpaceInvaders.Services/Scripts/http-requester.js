/// <reference path="require.js" />
/// <reference path="jquery-2.0.3.js" />
/// <reference path="rsvp.min.js" />
window.requester = (function () {
	function getJSON(serviceUrl) {
		var promise = new RSVP.Promise(function (resolve, reject) {
			$.ajax({
				url: serviceUrl,
				type: "GET",
				success: function (data) {
					resolve(data);
				},
				error: function (err) {
					reject(err);
				}
			});
		});
		return promise;
	}

	function postJSON(serviceUrl, data) {
		var promise = new RSVP.Promise(function (resolve, reject) {
			$.ajax({
				url: serviceUrl,
				dataType: "json",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(data),
				success: function (data) {
					resolve(data);
				},
				error: function (err) {
					reject(err);
				}
			});
		});
		return promise;
	}

	function putJSON(serviceUrl) {
	    var promise = new RSVP.Promise(function (resolve, reject) {
	        $.ajax({
	            url: serviceUrl,
	            type: "PUT",
	            success: function (data) {
	                resolve(data);
	            },
	            error: function (err) {
	                reject(err);
	            }
	        });
	    });
	    return promise;
	}

	return {
		getJSON: getJSON,
		postJSON: postJSON,
        putJSON: putJSON
	}
}(jQuery));