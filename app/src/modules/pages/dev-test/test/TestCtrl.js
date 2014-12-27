'use strict';

angular.module('myApp').controller('TestCtrl', ['$scope', '$timeout', 'appHttp', 'UserModel', '$location', '$q', function($scope, $timeout, appHttp, UserModel, $location, $q) {
	
	$scope.scopeOne ='scope one text';
	$scope.$on('appMyDirectiveEvent1', function(evt, params) {
		console.log('controller $on event');
	});
	$scope.funcOne =function() {
		console.log('funcOne called');
	};


	$scope.myVar ='var1';
	$scope.user =UserModel.load();
	
	$scope.swipeIt =function(evt, direction, params) {
		console.log('swipe: '+direction);
	};
	
	$scope.tapIt =function(evt, params) {
		console.log('tap');
	};

	function asyncFunc(var1, callback) {
		$timeout(function() {
			console.log('timeout finished');
			callback();
		}, 1000);
		console.log('timeout started');
	}

	function asyncFuncPromise(var1) {
		var deferred =$q.defer();
		$timeout(function() {
			console.log('timeout finished');
			deferred.resolve();
		}, 1000);
		console.log('timeout started');
		return deferred.promise;
	}

	$scope.$on('myEvt', function(evt, params) {
		console.log('async event done');
	});

	$scope.triggerAsync =function() {
		/*
		asyncFunc(5, function() {
			console.log('async done');
		})
		*/
		/*
		asyncFuncPromise(5)
		.then(function() {
			console.log('async promise resolved');
		});
		*/
		$timeout(function() {
			$scope.$broadcast('myEvt', {});
		}, 1000);
		$scope.$broadcast('myEvt', {});
	};
}]);