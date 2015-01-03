'use strict';

describe('CallbackGoogleAuthCtrl', function() {
	var $ctrl, $scope ={}, $httpBackend, $controller, $location;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_, _$location_) {
		$httpBackend =_$httpBackend_;
		$location =_$location_;
		$scope = _$rootScope_.$new();
		
		// $ctrl = _$controller_('CallbackGoogleAuthCtrl', {$scope: $scope});		//can't call here since need to set $routeParams FIRST in some tests
		$controller =_$controller_;
	}));
	
	it('should not work without proper url params', function() {
		$ctrl = $controller('CallbackGoogleAuthCtrl', {$scope: $scope});
	});
	
	it('should make backend api google call if url params are set properly', function() {
		$location.search({code:'code1', state:'randState'});		//hardcoded2 must match: state
		
		var user ={
			_id: 'userId',
			sess_id: 'sessId'
		};
		$httpBackend.expectPOST('/api/google/auth').respond({result: {user: user } });
		
		$ctrl = $controller('CallbackGoogleAuthCtrl', {$scope: $scope});
		
		$httpBackend.flush();
		
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
});