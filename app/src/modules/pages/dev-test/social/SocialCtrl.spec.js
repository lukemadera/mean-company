'use strict';

describe('SocialCtrl', function() {
	var $ctrl, $scope ={}, $httpBackend, $controller, UserModel;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_, _UserModel_) {
		$httpBackend =_$httpBackend_;
		UserModel =_UserModel_;
		$scope = _$rootScope_.$new();
		$controller =_$controller_;
	}));
	
	it('should not share on Facebook if no user Facebook token', function() {
		$ctrl = $controller('SocialCtrl', {$scope: $scope});
		$scope.shareFacebookFeed();
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
	it('should share Facebook feed', function() {
		UserModel.save({
			_id: 'userid1',
			social: {
				facebook: {
					token: 'fbtoken'
				}
			}
		});
		
		$ctrl = $controller('SocialCtrl', {$scope: $scope});
		$httpBackend.expectPOST('/api/facebook/publishUserFeed').respond({result: {}});
		
		$scope.shareFacebookFeed();
		
		$httpBackend.flush();
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
	it('should not share on Twitter if no user Twitter token', function() {
		$ctrl = $controller('SocialCtrl', {$scope: $scope});
		$scope.shareTwitter();
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
	it('should share Twitter tweet', function() {
		UserModel.save({
			_id: 'userid1',
			social: {
				twitter: {
					token: 'twitterToken',
					tokenSecret: 'twitterSecret'
				}
			}
		});
		
		$ctrl = $controller('SocialCtrl', {$scope: $scope});
		$httpBackend.expectPOST('/api/twitter/tweetWithPicture').respond({result: {}});
		
		$scope.shareTwitter();
		
		$httpBackend.flush();
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
});