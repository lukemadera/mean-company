/**
@module e2eMocks
@class e2eMocksApi

@toc
1. rpcUserSignupAndLogout
2. rpcUserDelete
*/

'use strict';

var lodash = require('lodash');
var inherits = require('util').inherits;

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

// var Base = require('./base');
// var Base = require('../../../routes/api/base.js');		//can't pass this in since it's used with inherits (which has to be outside the function definition??)
var Base =require(pathParts.routes+'api/base.js');

var E2eMocksMod = require(pathParts.controllers+'e2eMocks/e2eMocks.js');

var sampleE2eMocksReturn = {
	_id: "objectid",
};

var defaults = {
	group: 'e2eMocks',
	info: 'E2eMocks API',
	namespace: 'E2eMocks'
};

var db;

module.exports = E2eMocksApi;

/**
@param {Object} options
	@param {Object} db
*/
function E2eMocksApi(options){
	this.opts = lodash.extend({}, defaults, options||{});
	Base.call(this, this.opts);
	
	db =this.opts.db;
}

inherits(E2eMocksApi, Base);

E2eMocksApi.prototype.getRpcMethods = function(){
	return {
		userSignupAndLogout: this.rpcUserSignupAndLogout(),
		userDelete: this.rpcUserDelete()
	};
};

/**
@toc 1.
@method rpcUserSignupAndLogout
**/
E2eMocksApi.prototype.rpcUserSignupAndLogout = function(){
	var self = this;

	return {
		info: 'Creates one or more new users and then logs those users out',
		params: {
			users: { type: 'array', required: true, info: "Array of user objects for the user(s) to create; each user object should include at least the following fields: first_name, last_name, email, password" }
		},
		returns: {
			code: 'string',
			msg: 'string',
			users: 'array'
		},
		/**
		@method action
		@param {Object} params
			@param {Object} data
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise =E2eMocksMod.userSignupAndLogout(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
@toc 2.
@method rpcUserDelete
**/
E2eMocksApi.prototype.rpcUserDelete = function(){
	var self = this;

	return {
		info: 'Deletes one or more users',
		params: {
			_ids: { type: 'array', required: true, info: "Array of user ids to delete" }
		},
		returns: {
			code: 'string',
			msg: 'string'
		},
		/**
		@method action
		@param {Object} params
			@param {Object} data
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise =E2eMocksMod.userDelete(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};