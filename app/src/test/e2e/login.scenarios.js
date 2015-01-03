'use strict';

var apiCall =require('./helper/api-call.js');

var login =require('./pageobject/login.js');

var globals ={
	user: false
};

describe("E2E: Login", function() {

	// beforeEach(function() {
	// });
	
	//set up
	it('should signup and logout user', function() {
		browser.get('/');		//need to load a page to have angular be defined
		apiCall.userSignupAndLogout(1, {})
		.then(function(res) {
			globals.user =res.result.users[0];
		});
	});
	
	it('should login user', function() {
		//must pass plain text version of password!
		login.nav({email:globals.user.email, password:globals.user._password_plain_text}, {});
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
