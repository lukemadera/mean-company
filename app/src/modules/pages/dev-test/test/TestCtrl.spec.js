'use strict';

describe('TestCtrl', function(){
	var $ctrl, $scope ={}, UserModel;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _UserModel_) {
		$scope = _$rootScope_.$new();
		UserModel =_UserModel_;
		$ctrl = _$controller_('TestCtrl', {$scope: $scope});
	}));

	var user ={
		_id: 'userid1'
	};
	function setUserModel(params) {
		UserModel.save(user);
	}
	
	it('should have a funcOne function', function() {
		$scope.funcOne();
		expect($scope.log[($scope.log.length-1)]).toBe('funcOne called');
	});

	it('should have no user by default', function() {
		expect($scope.user._id).toBe(false);
	});

	it('should use existing user in UserModel', function() {
		setUserModel({});
		expect($scope.user._id).toBe(user._id);
	});
});