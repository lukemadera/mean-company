'use strict';

var E2e =function() {
	/**
	@toc 1.
	@method nav
	@return {Object}
		@param {Object} user
			@param {String} _id
			@param {String} sess_id
	*/
	this.nav =function(params) {
		var ret ={user: {}};
		var deferred =protractor.promise.defer();
		
		browser.get('/dev-test/e2e');
		expect(browser.getCurrentUrl()).toContain("/dev-test/e2e");
		
		/*
		//get cookies
		var selectorPrefix ='.e2e-cookies';
		browser.findElement(by.css(selectorPrefix+' .sess .val')).getText().then(function(html) {
			ret.user.sess_id =html;
		});
		browser.findElement(by.css(selectorPrefix+' .user .val')).getText().then(function(html) {
			ret.user._id =html;
		});
		*/
		
		//get user
		var selectorPrefix ='.e2e-user';
		browser.findElement(by.css(selectorPrefix+' ._id .val')).getText().then(function(html) {
			ret.user._id =html;
			
			browser.findElement(by.css(selectorPrefix+' .sess_id .val')).getText().then(function(html) {
				ret.user.sess_id =html;
				
				deferred.fulfill(ret);
			});
		});
		
		// return ret;
		return deferred.promise;
	};
};

module.exports = new E2e();