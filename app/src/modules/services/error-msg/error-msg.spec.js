'use strict';

describe('appErrorMsg factory', function() {
	var $rootScope ={}, appErrorMsg;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _appErrorMsg_) {
		$rootScope = _$rootScope_;
		appErrorMsg =_appErrorMsg_;
	}));
	
	// afterEach(function() {
	// });
	
	it('should not be found if no matching route', function() {
		var ret =appErrorMsg.getMessage('bad/route', 0, {});
		expect(ret.found).toBe(false);
	});
	
	it('should not be found if no matching route/code combination', function() {
		var ret =appErrorMsg.getMessage('auth/login', 999, {});
		expect(ret.found).toBe(false);
	});
	
	it('should return the message if matching route/code combination', function() {
		var ret =appErrorMsg.getMessage('auth/login', 1, {});
		expect(ret.found).toBe(true);
	});
});