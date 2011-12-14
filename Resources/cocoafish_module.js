function Client(applicationName, applicationkey) {
	this.COCOAFISH_APP_NAME = applicationName;
	this.COCOAFISH_APPLICATION_KEY = applicationkey;
	
	this.ENDPOINT = 'https://api.cocoafish.com/v1/';
	
	this.CURRENT_USER = {};
	this.CURRENT_PLACE = {};

	//Ti.API.debug(JSON.stringify(this));
}

/*
 LOGIN FUNCTION
 */
Client.prototype.login = function(args, callback) {
	var that = this;
	var xhr = Ti.Network.createHTTPClient();
	var params = {
		"login" : args.login,
		"password" : args.password
	};
	
	xhr.onerror = function(r) {
		var alertDialog = Titanium.UI.createAlertDialog({
			title : '',
			message : 'Unable to connect server. Please check network connection',
			buttonNames : ['OK']
		});
		alertDialog.show();
		Titanium.API.error("login " + JSON.stringify(r));
		Titanium.API.error(xhr.responseText);

		callback({
			"success" : false,
			"response" : xhr.responseText,
			"error" : r
		});
	};
	xhr.onload = function() {
		//Titanium.API.debug(" success " + xhr.responseText);
		callback({
			"success" : true,
			"response" : xhr.responseText
		});
		
		// SAVE THE CURRENT USER FOR LATER
		var respObject = JSON.parse(xhr.responseText);
		that.CURRENT_USER = respObject.response.users[0];
		Ti.API.info("Saved current user " + that.CURRENT_USER);
	};

	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.open('POST', that.ENDPOINT+"users/login.json?key=" + that.COCOAFISH_APPLICATION_KEY);
	xhr.send(params);
};

/*
 PLACE FUNCTION
*/
Client.prototype.place = function(callback) {
	var that = this;
	var xhr = Ti.Network.createHTTPClient();
	
	xhr.onerror = function(r) {
		var alertDialog = Titanium.UI.createAlertDialog({
			title : '',
			message : 'Unable to connect server. Please check network connection',
			buttonNames : ['OK']
		});
		alertDialog.show();
		Titanium.API.error("login " + JSON.stringify(r));
		Titanium.API.error(xhr.responseText);

		callback({
			"success" : false,
			"response" : xhr.responseText,
			"error" : r
		});
	};
	xhr.onload = function() {
		var respObj = JSON.parse(xhr.responseText);
		if(respObj.meta.status === 'ok' && respObj.meta.code === 200 && respObj.meta.method_name === 'searchPlaces') {
			callback({
				"success" : true,
				"response" : respObj
			});
		} else {
			callback({
				"success" : false,
				"response" : respObj,
				"error" : respObj.meta.message
			});
		}
	};

	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.open('GET', that.ENDPOINT+"places/search.json?key=" + that.COCOAFISH_APPLICATION_KEY);
	xhr.send();
};


exports.Client = Client;
