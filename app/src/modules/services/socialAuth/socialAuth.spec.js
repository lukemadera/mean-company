/**
@todo
- figure out how to make google auth not break karma coverage..
- figure out timing / how to get the appSocialAuth data to be/stay set for 2nd call..
*/

'use strict';

var googleInfo =[
	{
		token: {
			access_token: 'accessToken'
		},
		extraInfo: {
			user_id: 'userId',
			emailPrimary: 'emailPrimary'
		}
	},
	{
		token: {
			access_token: 'accessToken2'
		},
		extraInfo: {
			user_id: 'userId2'
			//no email
		}
	}
];
var curGoogInfo =googleInfo[0];

//mock google auth
var jrgGoogleAuthMock ={
	
	init: function(params) {
		var valid =true;
		if(params.client_id ===undefined) {
			valid =false;
		}
		return valid;
	},
	
	/*
	@param {Object} params
		@param {Object} callback
			@param {String} evtName
	*/
	// login: function(params) {
		// $rootScope.$broadcast(params.callback.evtName, googleInfo[0]);
	// }
};

describe('appSocialAuth', function(){
	var $rootScope ={}, appSocialAuth, $timeout;

    beforeEach(module('myApp'));
	// beforeEach(module('myApp', function($provide) {
		// $provide.value('jrgGoogleAuth', jrgGoogleAuthMock);
	// }));
	
	beforeEach(inject(function(_$rootScope_, _appSocialAuth_, _$timeout_, _jrgGoogleAuth_) {
		appSocialAuth =_appSocialAuth_;
		$rootScope =_$rootScope_;
		$timeout =_$timeout_;
		
		//mock out the service for this local one
		_jrgGoogleAuth_.init =jrgGoogleAuthMock.init;
		// _jrgGoogleAuth_.login =jrgGoogleAuthMock.login;		//doesn't work since $rootScope isn't defined..
		_jrgGoogleAuth_.login =function(params) {
			var googInfo =curGoogInfo;
			if(params.extraInfo ===undefined || !params.extraInfo) {
				delete googInfo.extraInfo;
			}
			$rootScope.$broadcast(params.callback.evtName, googInfo);
		};
	}));

	afterEach(function() {
		// $httpBackend.verifyNoOutstandingExpectation();
		// $httpBackend.verifyNoOutstandingRequest();
	});
	
	it('should do google auth', function() {
		var valid =false;
		appSocialAuth.checkAuthGoogle({})
		.then(function(data) {
			valid =true;
			expect(data.access_token).toBe(googleInfo[0].token.access_token);
		});
		$rootScope.$digest();
		//need 2nd call and digest for it to actually fire the event?! wtf?
		appSocialAuth.checkAuthGoogle({});
		$rootScope.$digest();
		
		expect(valid).toBe(true);
		
		//should resolve immediately if already authenticated
		appSocialAuth.checkAuthGoogle({});
		$rootScope.$digest();
	});
	
	it('should do google auth without emailPrimary', function() {
		curGoogInfo =googleInfo[1];		//switch to different google info
		
		var valid =false;
		appSocialAuth.checkAuthGoogle({})
		.then(function(data) {
			valid =true;
			expect(data.access_token).toBe(googleInfo[1].token.access_token);
		});
		$rootScope.$digest();
		//need 2nd call and digest for it to actually fire the event?! wtf?
		appSocialAuth.checkAuthGoogle({});
		$rootScope.$digest();
		
		expect(valid).toBe(true);;
	});
	
	/*
	it('should do facebook auth', function() {
		var fbInfo ={
			accessToken: 'accessToken',
			userID: 'facebookId'
		};
		
		appSocialAuth.checkAuthFacebook({}).
		then(function(ret) {
			if(0) {
			//still has data not set..
			console.log('resolved');
			//should resolve immediately if already authenticated
			appSocialAuth.checkAuthFacebook({});
			$rootScope.$digest();
			}
		});
		$rootScope.$digest();
		//hardcoded event name - must match what's set in service
		$rootScope.$broadcast('evtFBLogin', fbInfo);
		$rootScope.$digest();
		
		if(0) {
		//doesn't work - can't get data to be set..
		$timeout(function() {
		//should resolve immediately if already authenticated
		appSocialAuth.checkAuthFacebook({});
		$rootScope.$digest();
		}, 500);
		$timeout.flush();
		}
	});
	*/

});

