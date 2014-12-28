'use strict';

describe('appItemsList factory', function() {
	var $rootScope ={}, appItemsList;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _appItemsList_) {
		$rootScope = _$rootScope_;
		appItemsList =_appItemsList_;
	}));
	
	// afterEach(function() {
	// });
	
	/*
	it('should do something', function() {
	});
	*/
});