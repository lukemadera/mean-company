'use strict';

var util =require('util');

var config =require('./helper/config.js');
var selector =require('./helper/selector.js');

var signup =require('./pageobject/signup.js');
var userDelete =require('./pageobject/user-delete.js');

describe("E2E: Signup", function() {

	// beforeEach(function() {
	// });
	
	it('should have a working /signup route and allow creating a new user', function() {
		signup.nav();
	});
	
	//clean up - remove user (this is VITAL in case running tests in parallel - need to clear out afterward; deactivating at top isn't good enough; they should be gone all together)
	//must be LAST since other routes depend on being logged in!
	it('clean up - should delete user via a working /user-delete route', function() {
		userDelete.nav();
	});

});
