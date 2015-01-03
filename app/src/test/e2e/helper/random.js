'use strict';

var Random =function() {
	/**
	Generates a random string
	@method string1
	@param {Number} len Length of string to create
	@param {Object} params
		@param {String} type One of: 'readable' if want only readable chars (i.e. no uppercase "I" and lowercase "l" and number "1", which can look the same); otherwise it uses the full range of characters
	*/
	this.string1 =function(len, params) {
		var defaults ={'type':'full'};
		// params =angular.extend(defaults, params);
		//extend defaults
		var xx;
		for(xx in defaults) {
			if(params[xx] ===undefined) {
				params[xx] =defaults[xx];
			}
		}
		
		var chars;
		if(params.type =='full') {
			chars ="abcdefghijkmnopqrstuvwxyz023456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		}
		else if(params.type =='readable') {
			chars ="abcdefghijkmnopqrstuvwxyz023456789";
		}
		var randString ='';
		for(var ii=0; ii<len; ii++) {
			randString+=chars.charAt(Math.floor(Math.random()*chars.length));
		}
		return randString;
	};
};

module.exports = new Random();