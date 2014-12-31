'use strict';

angular.module('myApp').controller('TestCtrl', ['$scope', '$timeout', 'appHttp', 'UserModel', '$location', '$q', function($scope, $timeout, appHttp, UserModel, $location, $q) {
	
	$scope.myImage='';
	$scope.myCroppedImage='';

	var handleFileSelect=function(evt) {
	var file=evt.currentTarget.files[0];
	var reader = new FileReader();
	reader.onload = function (evt) {
	$scope.$apply(function($scope){
	$scope.myImage=evt.target.result;
	});
	};
	reader.readAsDataURL(file);
	};
	angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);





	
	$scope.log =[];
	function logIt(text) {
		console.log('logIt: '+text);
		$scope.log.push(text);
	}

	$scope.scopeOne ='scope one text';
	$scope.$on('appMyDirectiveEvent1', function(evt, params) {
		logIt('controller $on event');
	});
	$scope.funcOne =function() {
		logIt('funcOne called');
	};


	$scope.myVar ='var1';
	$scope.user =UserModel.load();
	
	$scope.swipeIt =function(evt, direction, params) {
		logIt('swipe: '+direction);
	};
	
	$scope.tapIt =function(evt, params) {
		logIt('tap');
	};

	function asyncFunc(var1, callback) {
		$timeout(function() {
			logIt('timeout finished');
			callback();
		}, 1000);
		logIt('timeout started');
	}

	function asyncFuncPromise(var1) {
		var deferred =$q.defer();
		$timeout(function() {
			logIt('timeout finished');
			deferred.resolve();
		}, 1000);
		logIt('timeout started');
		return deferred.promise;
	}

	$scope.$on('myEvt', function(evt, params) {
		logIt('async event done');
	});

	$scope.triggerAsync =function() {
		/*
		asyncFunc(5, function() {
			logIt('async done');
		})
		*/
		/*
		asyncFuncPromise(5)
		.then(function() {
			logIt('async promise resolved');
		});
		*/
		$timeout(function() {
			$scope.$broadcast('myEvt', {});
		}, 1000);
		$scope.$broadcast('myEvt', {});
	};
}]);