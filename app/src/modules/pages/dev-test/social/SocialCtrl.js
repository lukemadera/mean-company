/**
*/

'use strict';

angular.module('myApp').controller('SocialCtrl', ['$scope', 'appConfig', 'appHttp', 'UserModel', 
function($scope, appConfig, appHttp, UserModel) {

	$scope.user =UserModel.load();
	
	/*
	$scope.shareFacebook =function() {
		if($scope.user.social !==undefined && $scope.user.social.facebook !==undefined) {
			var urlBase =appConfig.dirPaths.publicPath;
			var vals ={
				object_type: 'product.item',
				object: {
					image: urlBase+'src/common/img/ie-chrome-logo.png',
					url: urlBase+'dev-test/social',
					title: 'og title!',
					description: 'og description!',
					//required product.item properties from: https://developers.facebook.com/docs/reference/opengraph/object-type/product.item/
					data: {
						availability: 'in stock',
						condition: 'new',
						price: {
							amount: 1.5,
							currency: 'USD'
						},
						retailer_item_id: 'retailerid'
					}
				},
				action_type: 'og.likes',
				// access_token: $scope.user.social.facebook.token
				user_id: $scope.user._id
			};
			appHttp.go({}, {url: 'facebook/createAndPublishObject', data:vals}, {})
			.then(function(response) {
				//handle success
			});
		}
		else {
			$scope.$emit('evtAppalertAlert', {type:'error', msg:'No user.social.facebook login/token yet! Login with Facebook first.'});
		}
	};
	*/
	
	$scope.shareFacebookFeed =function() {
		if($scope.user.social !==undefined && $scope.user.social.facebook !==undefined) {
			var urlBase =appConfig.dirPaths.publicPath;		//NOTE: this will NOT work on localhost - must be a PUBLIC url
			// urlBase ="http://198.199.118.44:3000/";		//TESTING locally
			var vals ={
				message: 'My message!',
				link: urlBase+'dev-test/social',
				picture: urlBase+'src/common/img/ie-chrome-logo.png',
				name: 'name!',
				caption: 'caption!',
				description: 'description!',
				// access_token: $scope.user.social.facebook.token
				user_id: $scope.user._id
			};
			appHttp.go({}, {url: 'facebook/publishUserFeed', data:vals}, {})
			.then(function(response) {
				$scope.$emit('evtAppalertAlert', {type:'success', msg:'Posted to Facebook!'});
			});
		}
		else {
			$scope.$emit('evtAppalertAlert', {type:'error', msg:'No user.social.facebook login/token yet! Login with Facebook first.'});
		}
	};
	
	$scope.shareTwitter =function() {
		if($scope.user.social !==undefined && $scope.user.social.twitter !==undefined) {
			var urlBase ='src/common/img';
			var vals ={
				user_id: $scope.user._id,
				tweet_text: 'my tweet!',
				pictures: [
					urlBase+'/ie-chrome-logo.png'
				]
			};
			appHttp.go({}, {url: 'twitter/tweetWithPicture', data:vals}, {})
			.then(function(response) {
				$scope.$emit('evtAppalertAlert', {type:'success', msg:'Posted to Twitter!'});
			});
		}
		else {
			$scope.$emit('evtAppalertAlert', {type:'error', msg:'No user.social.twitter login/token yet! Login with Twitter first.'});
		}
	};
	
}]);