/**
*/

'use strict';

angular.module('myApp').controller('MyPageCtrl', ['$scope', 'appItemsList', 
function($scope, appItemsList) {
	var items =[
		{
			title: 'one'
		},
		{
			title: 'two'
		},
		{
			title: 'three'
		},
		{
			title: 'four'
		}
	];
	appItemsList.save(items, {});

	$scope.items =appItemsList.read({});
	/*
	$scope.items =[
		{
			title: 'one'
		},
		{
			title: 'two'
		},
		{
			title: 'three'
		},
		{
			title: 'four'
		}
	];
	*/
}]);