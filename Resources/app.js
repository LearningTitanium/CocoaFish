// Based on the initial work done by Arron Saunders
//http://blog.clearlyinnovative.com/post/14175298162/titanium-appcelerator-quickie-cocoafish-api-module


var credentials = require('credentials').C;
var cocoafish = require('cocoafish_module');

var client = new cocoafish.Client(credentials.COCOAFISH_APP_NAME, credentials.COCOAFISH_API_KEY);

// login to the app
client.login({
	'login' : "sharry@molinto.com",
	'password' : "password"
}, function(e) {
	if(e.success === true) {
		Ti.API.info("logged in ok: " + JSON.stringify(e));
	} else {
		Ti.API.error(e.error);
	}
});



client.searchPlaces(function(e) {
	if(e.success === true) {
		alert("Status: "+e.response.meta.status +"\n" + e.response.meta.total_results + " place(s) found!");
	} else {
		Ti.API.error(e.error);
	}
});


/** CREATE A PLACE - SESSION MUST EXISTS FIRST! **/
client.createPlace({
	'name' : "My house",
	'latitude': "37.782227",
    'longitude': "-122.393159"
}, function(e) {
	if(e.success === true) {
		alert("Status: "+e.response.meta.status +"\n Place created!");
	} else {
		Ti.API.error(e.error);
	}
});

