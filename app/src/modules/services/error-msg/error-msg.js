/**
A factory style service (simple but can not be injected during the compile phase like a provider can be), see here for more info: http://stackoverflow.com/questions/15666048/angular-js-service-vs-provider-vs-factory

@toc
//TODO

@usage
//js Angular controller:
angular.module('myApp').controller('TestCtrl', ['$scope', 'appErrorMsg', function($scope, appErrorMsg) {
	var retVal =(appErrorMsg.test('my test val'));
	console.log(retVal);
}]);

*/

'use strict';

angular.module('app').factory('appErrorMsg', ['jrgArray', function(jrgArray) {

	//public methods & properties that will be returned
	var publicObj ={
		/**
		@toc 1.
		@method getMessage
		@param {String} route The url route that was called (i.e. 'auth/login')
		@param {Number} code The error code (i.e. 1)
		@param {Object} params
		@return {Object} ret
			@param {Boolean} found True if the route and code combination were found and matched to an error message
			@param {String} msg The error message to display
		*/
		getMessage: function(route, code, params) {
			var ret ={found:false, msg:''};
			if(messages[route] !==undefined) {
				var index1 =jrgArray.findArrayIndex(messages[route], 'code', code, {});
				if(index1 >-1) {
					ret.msg =messages[route][index1].msg;
					ret.found =true;
				}
			}
			return ret;
		}
		
		/*
		myPublicProperty: 'some value',
		
		@toc 2.
		@method method2
		@param {String} p1
		@param {Number} p2
		@return {Object} My return object
		method2: function(p1, p2) {
			//method/function body here
		}
		*/
	};
	
	//private methods and properties - should ONLY expose methods and properties publicly (via the 'return' object) that are supposed to be used; everything else (helper methods that aren't supposed to be called externally) should be private.
	
	/**
	@property messages Mapping of error messages
	@type Object
	*/
	var messages ={
		'auth/login': [
			{code: 2, msg: 'Invalid email'},
			{code: 1, msg: 'Invalid password'}
		]
	};
	
	/*
	@toc 3.
	@method function1
	@param {String} p1
	@param {Number} p2
	@return {Object} My return object
	function function1(p1, p2) {
		//method/function body here
	}
	*/
	
	return publicObj;
}]);