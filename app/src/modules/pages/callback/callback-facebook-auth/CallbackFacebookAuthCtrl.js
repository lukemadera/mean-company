/**
@toc
0. init
1. facebookAccessToken

HASH params from Facebook are used to get user login auth (access token)
*/

'use strict';

angular.module('myApp').controller('CallbackFacebookAuthCtrl', ['$scope', 'appHttp', 'UserModel', '$rootScope', '$location', 'appConfig', 
function($scope, appHttp, UserModel, $rootScope, $location, appConfig) {

	/**
	@toc 0.
	@method init
	*/
	function init(params) {
		//break hash string into hash params object
		var hashArr =$location.hash().split('&');
		var ii, hashPieces;
		var hashParams ={};
		for(ii =0; ii<hashArr.length; ii++) {
			hashPieces =hashArr[ii].split('=');
			hashParams[hashPieces[0]] =hashPieces[1];
		}
		if(hashParams.access_token !==undefined && hashParams.state !==undefined) {
			facebookAccessToken(hashParams);
		}
		else {
			alert('missing required URL (hash) params');
		}
	}
	
	/**
	@toc 1.
	@method facebookAccessToken
	@param {Object} params
		@param {String} access_token
	*/
	function facebookAccessToken(params) {
		/*
		//this works but we're not using facebook javascript SDK anymore - all server side instead
		FB.init({appId: appConfig.cfgJson.facebook.appId, frictionlessRequests: true, status: true, cookie: true, xfbml: true});
		FB.getLoginStatus(function(response) {
			if(response.authResponse || response.session) {
				FB.api('/me', function(response) {
					console.log(response);
					alert(JSON.stringify(response));
				});
			}
		});
		*/
		
		var vals ={
			access_token: params.access_token
		};
		appHttp.go({}, {url:'facebook/me', data:vals}, {}, {})
		.then(function(response) {
			var user =response.result.user;
			UserModel.save(user);
			$rootScope.$broadcast('loginEvt', {'loggedIn': true, 'sess_id':user.sess_id, 'user_id':user._id});
		});
	}
	
	init({});
}]);