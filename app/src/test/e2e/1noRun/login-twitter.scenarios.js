'use strict';

var apiCall =require('./helper/api-call.js');
var config =require('./helper/config.js');

var loginTwitter =require('./pageobject/login-twitter.js');

var globals ={
	user: false
};

describe("E2E: Login Twitter", function() {

	// beforeEach(function() {
	// });
	
	//set up
	//[none]
	
	it('should signup/login twitter user', function() {
		config.getCfgJson({})
		.then(function(res) {
			var twitterUser =res.cfgJson.e2e.twitter.logins[0];
			loginTwitter.nav(twitterUser, {})
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
