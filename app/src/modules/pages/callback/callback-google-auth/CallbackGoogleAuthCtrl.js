/**
@toc
0. init
1. googleAccessToken
*/

'use strict';

angular.module('myApp').controller('CallbackGoogleAuthCtrl', ['$scope', 'appHttp', 'UserModel', '$rootScope', '$location', 'appConfig', 
function($scope, appHttp, UserModel, $rootScope, $location, appConfig) {

	/**
	@toc 0.
	@method init
	*/
	function init(params) {
		var stateMatch ='randState';		//hardcoded2 - must match what's set in socialAuthBtn directive		//@todo - make this unique for security
		var urlParams =$location.search();
		if(urlParams.state !==undefined && urlParams.state ==stateMatch) {
			if(urlParams.code !==undefined) {
				googleAccessToken(urlParams.code, {});
			}
			else {
				alert('missing code URL param');
			}
		}
		else {
			alert('state not valid');
		}
	}
	
	/**
	@toc 1.
	@method googleAccessToken
	@param {String} code
	@param {Object} params
	*/
	function googleAccessToken(code, params) {
		var vals ={
			code: code
		};
		appHttp.go({}, {url:'google/auth', data:vals}, {}, {})
		.then(function(response) {
			var user =response.result.user;
			UserModel.save(user);
			$rootScope.$broadcast('loginEvt', {'loggedIn': true, 'sess_id':user.sess_id, 'user_id':user._id});
		});
	}
	
	init({});
}]);