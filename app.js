/* 
Testing CocoaFish in Titanium
http://www.learningtitanium.com
*/

Titanium.UI.setBackgroundColor('#000');

var win1 = Titanium.UI.createWindow({  
    title:'CocoaFish',
    backgroundColor:'#fff'
});

function connectionPresent(){
	if ( Titanium.Network.networkType === Titanium.Network.NETWORK_NONE ) {
	
		var alertDialog = Titanium.UI.createAlertDialog({
			title: 'Error',
			message: 'No internet connection found',
			buttonNames: ['OK']
		});
		alertDialog.show();
		return true;
	} else {
		return false;
	}
}

function getPlaces(){
	Ti.API.info("GetPlaces function called");
	var APIKEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcde';  // app key
	var BASEURL = "http://api.cocoafish.com/v1/";
	var places_url = BASEURL+"places/search.json?key="+APIKEY;
	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.open("POST", places_url, true);
	
	if(connectionPresent) {
		xhr.send();
	}
	
	xhr.onload = function(){
		var json = this.responseText;
		var data = JSON.parse(json);
		
		Ti.API.info(json);
		Ti.API.info(data);
		
		var meta = data.meta;
		if(meta.status == 'ok' && meta.code == 200 && meta.method_name == 'searchPlaces') {
			var places = data.response.places;
			Ti.API.info(places);
		}
		 else {
			alert("response NOT OK: "+data.message);
		}
	};
	
	xhr.onerror = function() {  
		Ti.API.error(this.status + ' - ' + this.statusText); 
		alert('WARNING, WARNING');
	}; 
}

function createUser(){
	Ti.API.info('createUser function called');
	var APIKEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcde';  // app key
	var BASEURL = "http://api.cocoafish.com/v1/";
	var user_url = BASEURL+"users/create.json?key="+APIKEY;
	var xhr = Titanium.Network.createHTTPClient();	

	xhr.open("POST", user_url, true);
	var params = {
		email: 'email@address.com', 
		role: 'teacher', 
		city: 'Douglas',
		first_name: "First", 
		last_name:"Last",
		password:"pass" ,
		password_confirmation:"pass"		
	};
	
	
	if(connectionPresent) {
		xhr.send(params);
	}
	
	xhr.onload = function(){
		var json = this.responseText;
		var data = JSON.parse(json);
		

		var meta = data.meta;
		if(meta.status == 'ok' && meta.code == 200 && meta.method_name == 'createUser') {
			//var user = JSON.stringify(data.response.users);
			alert('User added');
			
		}
		 else {
			alert("response NOT OK!");
		}
	};
	
	xhr.onerror = function() {  
		Ti.API.error(this.status + ' - ' + this.statusText); 
		alert('WARNING, WARNING');
	}; 
	
}




function populatePlace(){
	Ti.API.info('populatePlace function called');
	var APIKEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcde';  // app key
	var BASEURL = "http://api.cocoafish.com/v1/";
	var places_url = BASEURL+"places/create.json?key="+APIKEY;
	var xhr = Titanium.Network.createHTTPClient();	

	xhr.open("POST", places_url, true);
	var params = {
		name: 'My house', 
		latitude: 37.782227,
        longitude: -122.393159
	};
	
	
	if(connectionPresent) {
		xhr.send(params);
	}
	
	xhr.onload = function(){
		var json = this.responseText;
		var data = JSON.parse(json);
		

		var meta = data.meta;
		if(meta.status == 'ok' && meta.code == 200 && meta.method_name == 'createPlace') {
			alert('place added');
		}
		 else {
			alert("response NOT OK!");
		}
	};
	
	xhr.onerror = function() {  
		Ti.API.error(this.status + ' - ' + this.statusText); 
		alert('WARNING, WARNING');
	}; 
	
}


function login(){
	Ti.API.info('login function called');
	
	var APIKEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcde';  // app key
	var BASEURL = "http://api.cocoafish.com/v1/";
	var login_url = BASEURL+"users/login.json?key="+APIKEY;
	var xhr = Titanium.Network.createHTTPClient();	
	var params = {
        login: 'email@address.com',
        password: 'PASSWORD'
	};
	
	xhr.open("POST", login_url);
	
	if(connectionPresent) {
		xhr.send(params);
	}
	
	xhr.onload = function(){
		var json = this.responseText;
		var data = JSON.parse(json);
		
		var meta = data.meta;
		if(meta.status == 'ok' && meta.code == 200 && meta.method_name == 'loginUser') {
			//var user = JSON.stringify(data.response.users);
			alert('Logged in');
			
		}
		 else {
			alert("response NOT OK!");
		}
	};
	
	xhr.onerror = function() {  
		Ti.API.error(this.status + ' - ' + this.statusText); 
		alert('WARNING, WARNING');
	}; 
	
}

//populatePlace();
//getPlaces();
//createUser();

login();


