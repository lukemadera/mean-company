'use strict';

var config =require('../helper/config.js');

var Login =function() {
	/**
	@toc 1.
	@method nav
	@param {Object} user1
		@param {String} email
		@param {String} password
	*/
	this.nav =function(user1, params) {
		browser.get('/login');
		expect(browser.getCurrentUrl()).toContain("/login");
		
		//fill in login form
		var formSelector ='.login-form form';
		browser.findElement(by.css(formSelector+' .jrg-forminput-cont:nth-child(1) input')).sendKeys(user1.email);
		//password input is nested under another div for toggling forgot password visibility
		browser.findElement(by.css(formSelector+' div:nth-child(2) .jrg-forminput-cont:nth-child(1) input')).sendKeys(user1.password);
		
		//submit form
		browser.findElement(by.css('.login-form form button.btn-primary')).click();
		
		//expect page redirect after successful login
		expect(browser.getCurrentUrl()).toContain("/"+config.defaultPage);
	};
};

module.exports = new Login();