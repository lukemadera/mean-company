/**
*/

'use strict';

angular.module('myApp').controller('MyPageCtrl', ['$scope',
function($scope) {
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
}]);