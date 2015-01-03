'use strict';

var apiCall =require('./helper/api-call.js');
var config =require('./helper/config.js');

var loginGoogle =require('./pageobject/login-google.js');

var globals ={
	user: false
};

describe("E2E: Login Google", function() {

	// beforeEach(function() {
	// });
	
	//set up
	//[none]
	
	it('should signup/login google user', function() {
		config.getCfgJson({})
		.then(function(res) {
			var googleUser =res.cfgJson.e2e.google.logins[0];
			loginGoogle.nav(googleUser, {})
			.then(function(retLogin) {
				globals.user =retLogin.user;
			});
		}, function(resErr) {
			expect('ERROR: config.getCfgJson reject: '+resErr).toBe('noError');
		});
	});
	
	//tear down / clean up
	it('should delete user', function() {
		browser.get('/logout');		//need to logout user on frontend too
		apiCall.userDelete([globals.user._id], {})
		.then(function(res) {
			expect(1).toBe(1);
		}, function(resErr) {
			expect(1).toBe(0);
		});
	});

});
