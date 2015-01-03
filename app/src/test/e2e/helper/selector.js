'use strict';

var Selector =function() {
	/**
	Forms the 'contains' xpath syntax necessary for finding a class in case it's not the ONLY class on the element
	@method hasClass
	*/
	this.hasClass =function(class1, params) {
		return "contains(concat(' ', @class, ' '), ' "+class1+" ')";
	};
};

module.exports = new Selector();