/**
@todo
- figure out how to actually test this?
*/

'use strict';

var googData =[
	{
		google_id: 'googleid1',
		access_token: 'accessToken1'
	},
	{
		google_id: 'googleid2',
		access_token: 'accessToken2',
		email: 'email2',
	}
];
var curGoogData =googData[0];

describe('appSocialAuthBtn', function () {
	var elm, elmScope, $scope, $compile, $timeout, $httpBackend, $q;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_, _$httpBackend_, _appSocialAuth_, _$q_) {
		$compile = _$compile_;
		$timeout = _$timeout_;
		$httpBackend = _$httpBackend_;
		$scope = _$rootScope_.$new();
		
		$httpBackend.expectPOST('/api/twitter/requestToken').respond({result: {} });
		
		//mock out the service for this local one
		$q =_$q_;
		_appSocialAuth_.checkAuthGoogle =function(params) {
			var deferred =$q.defer();
			
			var data =curGoogData;
			deferred.resolve(data);
			
			return deferred.promise;
		};
	}));
	
	afterEach(function() {
		$httpBackend.flush();		//twitter requestToken
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
	/**
	@param params
	*/
	var createElm =function(params) {
		var html ="<div app-social-auth-btn>"+
		"</div>";
		if(params.html) {
			html =params.html;
		}
		// elm =angular.element(html);
		elm =$compile(html)($scope);
		// $scope.$digest();
		$scope.$apply();		//NOTE: required otherwise the alert directive won't be compiled!!!! ... wtf?
		elmScope =elm.isolateScope();
		var elements ={
		};
		return elements;
	};
	
	/*
	it('should do facebook login', function() {
		var eles =createElm({});
		
		elmScope.fbLogin({});
	});
	*/
	
	//this causes test to fail.. not sure why..
	it('should do google login', function() {
		var user ={
			_id: 'userid1',
			sess_id: 'sessid'
		};
		$httpBackend.expectPOST('/api/auth/socialLogin').respond({result: {user: user} });
		var eles =createElm({});
		
		elmScope.googleLogin({});
	});
	
	//this causes test to fail.. not sure why..
	it('should do google login with EMAIL', function() {
		curGoogData =googData[1];		//update to one that has an email
		var user ={
			_id: 'userid1',
			sess_id: 'sessid'
		};
		$httpBackend.expectPOST('/api/auth/socialLogin').respond({result: {user: user} });
		var eles =createElm({});
		
		elmScope.googleLogin({});
	});
	
});	