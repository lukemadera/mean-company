/**
@module google
@class googleApi

@toc
1. rpcAuth
*/

'use strict';

var lodash = require('lodash');
var inherits = require('util').inherits;

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

// var Base = require('./base');
// var Base = require('../../../routes/api/base.js');		//can't pass this in since it's used with inherits (which has to be outside the function definition??)
var Base =require(pathParts.routes+'api/base.js');

var GoogleMod = require(pathParts.controllers+'google/google.js');

var sampleGoogleReturn = {
	_id: "objectid"
};

var defaults = {
	group: 'google',
	info: 'Google API',
	namespace: 'Google'
};

var db;

module.exports = GoogleApi;

/**
@param {Object} options
	@param {Object} db
*/
function GoogleApi(options){
	this.opts = lodash.extend({}, defaults, options||{});
	Base.call(this, this.opts);
	
	db =this.opts.db;
}

inherits(GoogleApi, Base);

GoogleApi.prototype.getRpcMethods = function(){
	return {
		auth: this.rpcAuth()
	};
};

/**
@toc 1.
@method rpcAuth
**/
GoogleApi.prototype.rpcAuth = function(){
	var self = this;

	return {
		info: 'Use a code to get user tokens',
		params: {
			code: { type: 'string', required: true, info: "Code for authenticating user" },
			pull_pic: { type: 'number', required: false, info: "0 to NOT pull profile image from google. This will be better for performance and avoiding creating image files on the server if you are not using user pictures. By default, it WILL pull the image IF it does not exist (i.e. no overwrites will happen in case the user set their profile picture manually we do not want to change it on each login!)" },
			pic_directory: { type: 'string', required: false, info: "Where to save the user image. Default: 'user'" }
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
			var promise =GoogleMod.auth(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};