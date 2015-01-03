'use strict';

describe('E2eCtrl', function() {
	var $ctrl, $scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_) {
		$scope = _$rootScope_.$new();
		$ctrl = _$controller_('E2eCtrl', {$scope: $scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});