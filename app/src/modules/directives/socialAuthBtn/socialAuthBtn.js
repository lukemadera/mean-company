/**
NOTE: this directive has http (backend) calls in it! In general this is bad practice but it makes things simpler since most of it is backend calls.

@toc


@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'
	@param {String} [buttonText ='Login'] The text to put in both buttons


@usage
partial / html:
<div app-social-auth-btn button-text='Sign Up'></div>

controller / js:

//end: EXAMPLE usage
*/

'use strict';

angular.module('app').directive('appSocialAuthBtn', ['appHttp', 'UserModel', 'appConfig', '$rootScope', 'appSocialAuth',
function (appHttp, UserModel, appConfig, $rootScope, appSocialAuth) {
  return {
		restrict: 'A',
		scope: {
		},
		
		template: function(element, attrs) {
			var defaultAttrs ={
				buttonText: 'Login'
			};
			attrs =angular.extend(defaultAttrs, attrs);
			
			var html ="<div class='social-auth-btn-buttons center margin-t'>"+
				// "<div class='social-auth-btn-button-facebook' ng-click='fbLogin()'><i class='fa fa-facebook padding-lr social-auth-btn-button-icon'></i><div class='social-auth-btn-button-text'>"+attrs.buttonText+"</div></div>"+
				// "<div class='social-auth-btn-button-facebook' ng-click='fbLogin()'><i class='fa fa-facebook padding-lr social-auth-btn-button-icon'></i><div class='social-auth-btn-button-text'>Facebook</div></div>"+
				"<a class='a-div social-auth-btn-button-facebook' ng-href='{{fbLink}}'><i class='fa fa-facebook padding-lr social-auth-btn-button-icon'></i><div class='social-auth-btn-button-text'>Facebook</div></a>"+
				"<div class='social-auth-btn-button-google' ng-click='googleLogin()'><i class='fa fa-google-plus padding-lr social-auth-btn-button-icon'></i><div class='social-auth-btn-button-text'>Google+</div></div>"+
				"<a class='a-div social-auth-btn-button-twitter' ng-href='{{twitterLink}}'><i class='fa fa-twitter padding-lr social-auth-btn-button-icon'></i><div class='social-auth-btn-button-text'>Twitter</div></a>"+
			"</div>";
			return html;
		},
		
		controller: function($scope, $element, $attrs) {
		
			var twitterLinkPart ='authorize';		//this will always give user the option to change users - https://dev.twitter.com/docs/api/1/get/oauth/authorize
			// twitterLinkPart ='authenticate';		//use this to auto redirect if already logged in to twitter and have authorized this app before (good unless want to be able to change users..) - https://dev.twitter.com/docs/api/1/get/oauth/authenticate
			
			$scope.twitter ={
				requestToken: false,
				requestTokenSecret: false,
				// callback_url: appConfig.cfgJson.twitter.callback_url
			};
			
			$scope.fbLink ='';		//will be formed in init
			
			$scope.twitterLink ='';		//will be formed in init
			
			/**
			@toc 0.
			@method init
			*/
			function init(params) {
				//form facebook link
				var publicPathNoSlash =appConfig.dirPaths.publicPath.slice(0, (appConfig.dirPaths.publicPath.length-1));
				var redirectUri =publicPathNoSlash+appConfig.dirPaths.appPathLink+'callback-facebook-auth';
				var state ='randState';		//@todo - vary this by user (and by session) for security
				$scope.fbLink ='https://www.facebook.com/dialog/oauth?client_id='+appConfig.cfgJson.facebook.appId+'&redirect_uri='+redirectUri+'&response_type=token&scope='+appConfig.cfgJson.facebook.scope+'&state='+state;
				
				//get twitter request token
				appHttp.go({}, {url:'twitter/requestToken', data:{} }, {}, {})
				.then(function(response) {
					$scope.twitter.requestToken =response.result.request_token;
					$scope.twitter.requestTokenSecret =response.result.request_token_secret;
					
					$scope.twitterLink ='https://api.twitter.com/oauth/'+twitterLinkPart+'?oauth_token='+$scope.twitter.requestToken;
				});
			}
			
			/**
			Facebook login handling (in LoginCtrl which is PARENT of LoginFormCtrl and SignupFormCtrl so can use this function for BOTH login and sign up)
			@toc 1.
			@method $scope.fbLogin
			*/
			/*
			$scope.fbLogin =function() {
				var promise =appSocialAuth.checkAuthFacebook({});
				promise.then(function(data) {
					var vals ={
						type: 'facebook',
						user: {},
						socialData: {
							id: data.facebook_id,
							token: data.access_token
						}
					};
					if(data.email) {
						vals.user.email =data.email;
					}
					var promise1 =appHttp.go({}, {url:'auth/socialLogin', data:vals}, {}, {});
					promise1.then(function(response) {
						var user =response.result.user;
						UserModel.save(user);
						$rootScope.$broadcast('loginEvt', {'loggedIn': true, 'sess_id':user.sess_id, 'user_id':user._id});
					});
				}, function(data) {
					var dummy =1;
				});
			};
			*/
			
			
			/**
			Google login handling (in LoginCtrl which is PARENT of LoginFormCtrl and SignupFormCtrl so can use this function for BOTH login and sign up)
			@toc 2.
			@method $scope.googleLogin
			*/
			$scope.googleLogin =function() {
				var promise =appSocialAuth.checkAuthGoogle({});
				promise.then(function(data) {
					var vals ={
						type: 'google',
						user: {},
						socialData: {
							id: data.google_id,
							token: data.access_token
						}
					};
					if(data.email) {
						vals.user.email =data.email;
					}
					if(data.rawData !==undefined) {
						if(data.rawData.name !==undefined) {
							if(data.rawData.name.givenName !==undefined) {
								vals.user.first_name =data.rawData.name.givenName;
							}
							if(data.rawData.name.familyName !==undefined) {
								vals.user.last_name =data.rawData.name.familyName;
							}
						}
						if(data.rawData.image !==undefined && data.rawData.image.url !==undefined) {
							vals.user._imageUrl =data.rawData.image.url;
						}
					}
					var promise1 =appHttp.go({}, {url:'auth/socialLogin', data:vals}, {}, {});
					promise1.then(function(response) {
						var user =response.result.user;
						UserModel.save(user);
						$rootScope.$broadcast('loginEvt', {'loggedIn': true, 'sess_id':user.sess_id, 'user_id':user._id});
					});
				//no reject's so can't get error
				// }, function(data) {
					// var dummy =1;
				});
			};
			
			init({});
		}
	};
}]);