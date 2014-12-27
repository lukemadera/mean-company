/**
@toc

@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
	@param {String} scopeOne Custom scope property
	@param {Function} funcOne A function passed in

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'
	@param {String} customText Some special text to use

@dependencies
TODO

@usage
partial / html:
<div app-my-directive></div>
TODO

controller / js:
TODO

//end: usage
*/

'use strict';

angular.module('app').directive('appMyDirective', [ function () {

	return {
		restrict: 'A',
		scope: {
			scopeOne: '=',
			funcOne: '&?'
		},

		// replace: true,
		template: function(element, attrs) {
			var defaultsAttrs ={
			};
			for(var xx in defaultsAttrs) {
				if(attrs[xx] ===undefined) {
					attrs[xx] =defaultsAttrs[xx];
				}
			}
			
			if(!attrs.customText) {
				attrs.customText ='';
			}
			var html ="<div class='app-my-directive-cont'>"+
				"my-directive edit"+
				"<br />line 2"+
				"customText: "+attrs.customText+"<br />"+
				"scopeOne: {{scopeOne}} <br />"+
				"scopeTwo: {{scopeTwo}} <br />"+
				"<btn class='btn' ng-click='emitEvent()'>Emit event</btn>"+
				"<btn class='btn' ng-click='funcOne()'>Func One</btn>"+
				"<br />"+
			"</div>";
			return html;
		},
		
		link: function(scope, element, attrs) {
		},
		
		controller: function($scope, $element, $attrs) {
			$scope.scopeTwo ='scope two';

			$scope.emitEvent =function() {
				$scope.$emit('appMyDirectiveEvent1', {});
				console.log('app-my-directive event emitted');
			};

			$scope.funcOne();
		}
	};
}]);