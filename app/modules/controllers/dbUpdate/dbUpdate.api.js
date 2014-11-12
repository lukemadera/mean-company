/**
@module dbUpdate
@class dbUpdateApi

@toc
1. rpcSessId
*/

'use strict';

var lodash = require('lodash');
var inherits = require('util').inherits;

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

// var Base = require('./base');
// var Base = require('../../../routes/api/base.js');		//can't pass this in since it's used with inherits (which has to be outside the function definition??)
var Base =require(pathParts.routes+'api/base.js');

var DbUpdateMod = require(pathParts.controllers+'dbUpdate/dbUpdate.js');

var sampleDbUpdateReturn = {
	_id: "objectid",
};

var defaults = {
	group: 'dbUpdate',
	info: 'DbUpdate API',
	namespace: 'DbUpdate'
};

var db;

module.exports = DbUpdateApi;

/**
@param {Object} options
	@param {Object} db
*/
function DbUpdateApi(options){
	this.opts = lodash.extend({}, defaults, options||{});
	Base.call(this, this.opts);
	
	db =this.opts.db;
}

inherits(DbUpdateApi, Base);

DbUpdateApi.prototype.getRpcMethods = function(){
	return {
		sessId: this.rpcSessId()
	};
};

/**
@toc 1.
@method rpcSessId
**/
DbUpdateApi.prototype.rpcSessId = function(){
	var self = this;

	return {
		info: 'Go through all users and convert sess_id from string to array',
		params: {
		},
		returns: {
			code: 'string',
			msg: 'string',
			results: 'array'
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
			var promise =DbUpdateMod.sessId(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};