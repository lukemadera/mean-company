'use strict';

var config =require('../helper/config.js');

var e2e =require('./e2e.js');

//create random id so this user is unique
var randString =Math.random().toString(36).substring(7)
var randId =new Date().getTime()+'_'+randString;		//use timestamp also to ensure much lower probability of duplicates
var numDigits =10;
var randNum10 =Math.floor(Math.pow(10, numDigits-1) + Math.random() * 9 * Math.pow(10, numDigits-1));

//user info
var user1 ={
	name: 'e2e '+randString,
	email: 'e2e_'+randId+'@e2e.com',
	phone: {
		number: randNum10
	},
	password: 'e2eTesting'
};

var Signup =function() {
	/**
	@toc 1.
	@method nav
	@param {Object} params
		@param {Object} [user] The user to sign up; otherwise default will be used
			@param {String} email
			@param {String} password
			@param {String} name
		@param {String} [redirectPage] The page we'll expect to go to after sign up
		@param {Boolean} [alreadyOnPage] True to NOT re browser.get the page
	@return {Object} (via Promise)
		@param {Object} user
			@param {String} _id
			@param {String} sess_id
	*/
	this.nav =function(params) {
		var ret ={user: {}};
		var deferred =protractor.promise.defer();
		
		if(params ===undefined) {
			params ={};
		}
		var userSignup =user1;
		if(params.user !==undefined) {
			userSignup =params.user;
		}
		var redirectPage ="/"+config.defaultPage;
		if(params.redirectPage !==undefined) {
			redirectPage ="/"+params.redirectPage;
		}
		
		if(params.alreadyOnPage ===undefined || !params.alreadyOnPage) {
			browser.get('/signup');
		}
		expect(browser.getCurrentUrl()).toContain("/signup");
		
		//fill in signup form
		var formSelector ='.signup-form form';
		browser.findElement(by.css(formSelector+' .jrg-forminput-cont:nth-child(1) input')).sendKeys(userSignup.name);
		browser.findElement(by.css(formSelector+' .jrg-forminput-cont:nth-child(2) input')).sendKeys(userSignup.email);
		// browser.findElement(by.css(formSelector+' .jrg-forminput-cont:nth-child(3) input')).sendKeys(userSignup.phone.number);
		browser.findElement(by.css(formSelector+' .jrg-forminput-cont:nth-child(3) input')).sendKeys(userSignup.password);
		browser.findElement(by.css(formSelector+' .jrg-forminput-cont:nth-child(4) input')).sendKeys(userSignup.password);
		
		//submit form
		browser.findElement(by.css('.signup-form form button.btn-primary')).click();
		
		//expect page redirect after successful login
		expect(browser.getCurrentUrl()).toContain(redirectPage);
		
		//now that logged in, get user info (since can not really get it from the social login process directly?)
		e2e.nav({})
		.then(function(retE2e) {
			ret.user =retE2e.user;
			deferred.fulfill(ret);
		});
		
		return deferred.promise;
	};
};

module.exports = new Signup();