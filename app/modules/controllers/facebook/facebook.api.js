/**
@module facebook
@class facebookApi

@toc
1. rpcMe
2. rpcCreateAppObject
3. rpcPublishObjectStory
4. rpcCreateAndPublishObject
5. rpcPublishUserFeed
*/

'use strict';

var lodash = require('lodash');
var inherits = require('util').inherits;

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

// var Base = require('./base');
// var Base = require('../../../routes/api/base.js');		//can't pass this in since it's used with inherits (which has to be outside the function definition??)
var Base =require(pathParts.routes+'api/base.js');

var FacebookMod = require(pathParts.controllers+'facebook/facebook.js');

var sampleFacebookReturn = {
	_id: "objectid"
};

var defaults = {
	group: 'facebook',
	info: 'Facebook API',
	namespace: 'Facebook'
};

var db;

module.exports = FacebookApi;

/**
@param {Object} options
	@param {Object} db
*/
function FacebookApi(options){
	this.opts = lodash.extend({}, defaults, options||{});
	Base.call(this, this.opts);
	
	db =this.opts.db;
}

inherits(FacebookApi, Base);

FacebookApi.prototype.getRpcMethods = function(){
	return {
		me: this.rpcMe(),
		createAppObject: this.rpcCreateAppObject(),
		publishObjectStory: this.rpcPublishObjectStory(),
		createAndPublishObject: this.rpcCreateAndPublishObject(),
		publishUserFeed: this.rpcPublishUserFeed()
	};
};

/**
@toc 1.
@method rpcMe
**/
FacebookApi.prototype.rpcMe = function(){
	var self = this;

	return {
		info: 'Get the logged in user (the user with the access token)',
		params: {
			access_token: { type: 'string', required: true, info: "Access token for user to get" },
			pull_pic: { type: 'number', required: false, info: "0 to NOT pull profile image from facebook. This will be better for performance and avoiding creating image files on the server if you are not using user pictures. By default, it WILL pull the image IF it does not exist (i.e. no overwrites will happen in case the user set their profile picture manually we do not want to change it on each login!)" },
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
			var promise =FacebookMod.me(db, params, {});
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
@method rpcCreateAppObject
**/
FacebookApi.prototype.rpcCreateAppObject = function(){
	var self = this;

	return {
		info: '',
		params: {
			object_type: { type: 'string', required: true, info: "object_type E.g. 'book' or 'books.book'" },
			object: { type: 'object', required: true, info: "The object. Typically includes title, image, url, description fields" }
		},
		returns: {
			code: 'string',
			msg: 'string',
			object_id: 'string'
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
			var promise =FacebookMod.createAppObject(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
@toc 3.
@method rpcPublishObjectStory
**/
FacebookApi.prototype.rpcPublishObjectStory = function(){
	var self = this;

	return {
		info: '',
		params: {
			action_type: { type: 'string', required: true, info: "E.g. 'books.reads'" },
			object_type: { type: 'string', required: true, info: "object_type E.g. 'book' or 'books.book'" },
			object_id: { type: 'string', required: true, info: "The id of the object to reference / post" },
			access_token: { type: 'string', required: false, info: "The user access token to publish for (this will save a database call to look it up from the user id). One of 'user_id' or 'access_token' is required." },
			user_id: { type: 'string', required: false, info: "The user id to publish for (this will require a database call to look up the token from the user id and will NOT work if the user does not yet have a facebook access token). One of 'user_id' or 'access_token' is required." }
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
			var promise =FacebookMod.publishObjectStory(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
@toc 4.
@method rpcCreateAndPublishObject
**/
FacebookApi.prototype.rpcCreateAndPublishObject = function(){
	var self = this;

	return {
		info: 'Convenience method that combines createAppObject and publishObjectStory into one call. This is effectively "share on facebook".',
		params: {
			object_type: { type: 'string', required: true, info: "object_type E.g. 'book' or 'books.book'" },
			object: { type: 'object', required: true, info: "The object. Typically includes title, image, url, description fields" },
			action_type: { type: 'string', required: true, info: "E.g. 'books.reads'" },
			access_token: { type: 'string', required: false, info: "The user access token to publish for (this will save a database call to look it up from the user id). One of 'user_id' or 'access_token' is required." },
			user_id: { type: 'string', required: false, info: "The user id to publish for (this will require a database call to look up the token from the user id and will NOT work if the user does not yet have a facebook access token). One of 'user_id' or 'access_token' is required." }
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
			var promise =FacebookMod.createAndPublishObject(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
@toc 5.
@method rpcPublishUserFeed
**/
FacebookApi.prototype.rpcPublishUserFeed = function(){
	var self = this;

	return {
		info: "The more standard / simple share on Facebook",
		params: {
			message: { type: 'string', required: false, info: "The user message for this post. One of 'message' or 'link' is required." },
			link: { type: 'string', required: false, info: "The publicly accessible url to link to for this post. One of 'message' or 'link' is required." },
			picture: { type: 'string', required: false, info: "URL path to publicly accessible image. Only relevant if 'link' is set." },
			name: { type: 'string', required: false, info: " Only relevant if 'link' is set." },
			caption: { type: 'string', required: false, info: " Only relevant if 'link' is set." },
			description: { type: 'string', required: false, info: " Only relevant if 'link' is set." },
			access_token: { type: 'string', required: false, info: "The user access token to publish for (this will save a database call to look it up from the user id). One of 'user_id' or 'access_token' is required." },
			user_id: { type: 'string', required: false, info: "The user id to publish for (this will require a database call to look up the token from the user id and will NOT work if the user does not yet have a facebook access token). One of 'user_id' or 'access_token' is required." }
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
			var promise =FacebookMod.publishUserFeed(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};