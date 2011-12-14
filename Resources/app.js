//include Cocoafish & credentials module
var credentials = require('credentials').C;
var cocoafish = require('cocoafish_module');

//create Cocoafish Client
var client = new cocoafish.Client(credentials.COCOAFISH_APP_NAME, credentials.COCOAFISH_API_KEY);

// login to the app
/*
client.login({
	'login' : "sharry@molinto.com",
	'password' : "password"
}, function(e) {
	if(e.success === true) {
		Ti.API.info("login " + JSON.stringify(e));
		alert(JSON.stringify(e));
	} else {
		Ti.API.error(e.error);
	}
});
*/

client.place(function(e) {
	if(e.success === true) {
		//Ti.API.info("place " + JSON.stringify(e));
		//alert(JSON.stringify(e));
		alert("Status: "+e.response.meta.status +"\n" + e.response.meta.total_results + " place(s) found!");
	} else {
		Ti.API.error(e.error);
	}
});