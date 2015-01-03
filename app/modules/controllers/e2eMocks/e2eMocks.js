/**
@module e2eMocks
@class e2eMocks

@toc
1. userSignupAndLogout
2. userDelete
*/

'use strict';

var Q = require('q');
var lodash = require('lodash');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

// var StringMod =require(pathParts.services+'string/string.js');

var AuthMod =require(pathParts.controllers+'auth/auth.js');
var UserMod =require(pathParts.controllers+'user/user.js');

var self;

var defaults = {
};

/**
E2eMocks module constructor
@class E2eMocks
@constructor
@param options {Object} constructor options
**/
function E2eMocks(options){
    this.opts = lodash.merge({}, defaults, options||{});

	self = this;
}

/**
@toc 1.
@method userSignupAndLogout
@param {Object} data
	@param {Array} users Array of user objects to create new user(s) with; each object is user info of at least:
		@param {String} email
		@param {String} password
		@param {String} first_name
		@param {String} last_name
@param {Object} params
@return {Object} (via Promise)
		@param {Number} code
		@param {String} msg
		@param {Array} [users] The users, if successful
**/
E2eMocks.prototype.userSignupAndLogout = function(db, data, params) {
	var deferred = Q.defer();
	var ret ={code:0, msg:'E2eMocks.userSignup ', users:[] };
	
	var promises =[], deferreds =[];
	var ii;
	for(ii =0; ii<data.users.length; ii++) {
		//need closure inside for loop
		(function(ii) {
			deferreds[ii] =Q.defer();
			promises[ii] =deferreds[ii].promise;
			//A. create user
			AuthMod.create(db, data.users[ii], {})
			.then(function(retCreate) {
				ret.users[ii] =retCreate.user;
				//B. logout user
				AuthMod.logout(db, {user_id:retCreate.user._id, sess_id:retCreate.user.sess_id}, {})
				.then(function(retLogout) {
					deferreds[ii].resolve(ret);
				}, function(retErr) {
					deferreds[ii].reject(retErr);
				});
			}, function(retErr) {
				deferreds[ii].reject(retErr);
			});
		})(ii);
	}
	
	//once have updated all users, resolve
	Q.all(promises).then(function(ret1) {
		deferred.resolve(ret);
	}, function(err) {
		deferred.reject(ret);
	});

	return deferred.promise;
};

/**
@toc 2.
@method userDelete
@param {Object} data
	@param {Array} _ids Ids of users to delete (will be converted to mongo object ids if necessary).
@param {Object} params
@return {Object} (via Promise)
		@param {Number} code
		@param {String} msg
**/
E2eMocks.prototype.userDelete = function(db, data, params) {
	var deferred = Q.defer();
	var ret ={code:0, msg:'E2eMocks.userDelete ' };
	
	UserMod.delete1(db, data, {})
	.then(function(retDelete) {
		deferred.resolve(ret);
	}, function(retErr) {
		deferred.reject(retErr);
	});
	
	return deferred.promise;
};


/**
Module exports
@method exports
@return {E2eMocks} E2eMocks constructor
**/
module.exports = new E2eMocks({});