/**
@module dbUpdate
@class dbUpdate

@toc
1. sessId
*/

'use strict';

var Q = require('q');
var lodash = require('lodash');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

// var StringMod =require(pathParts.services+'string/string.js');
var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');

var self;

var defaults = {
};

/**
DbUpdate module constructor
@class DbUpdate
@constructor
@param options {Object} constructor options
**/
function DbUpdate(options){
    this.opts = lodash.merge({}, defaults, options||{});

	self = this;
}

/**
@toc 1.
@method sessId
@param {Object} data
@param {Object} params
@return {Object} (via Promise)
		@param {Number} code
		@param {String} msg
		@param {Array} results
**/
DbUpdate.prototype.sessId = function(db, data, params) {
	var deferred = Q.defer();
	var ret ={code:0, msg:'DbUpdate.sessId ', results:false};

	db.user.find({}, {sess_id:1}).toArray(function(err, records) {
		var promises =[], deferreds =[];
		var ii, counter;
		for(ii =0; ii<records.length; ii++) {
			//need closure inside for loop
			(function(ii) {
				deferreds[ii] =Q.defer();
				promises[ii] =deferreds[ii].promise;
				//if session id is a string, convert it to an array and re-save
				if(typeof(records[ii].sess_id) =='string') {
					db.user.update({_id: MongoDBMod.makeIds({'id': records[ii]._id}) }, {$set: {sess_id: [ records[ii].sess_id ] } }, function(err, valid) {
						if(err) {
							ret.msg +='Error: '+err;
							deferreds[ii].reject(ret);
						}
						else if(!valid) {
							ret.msg +='Invalid ';
							deferreds[ii].reject(ret);
						}
						else {
							deferreds[ii].resolve({});
						}
					});
				}
				else {
					deferreds[ii].resolve({});
				}
			})(ii);
		}
		
		//once have updated all users, resolve
		Q.all(promises).then(function(ret1) {
			deferred.resolve(ret);
		}, function(err) {
			deferred.resolve(ret);
		});
	});

	return deferred.promise;
};


/**
Module exports
@method exports
@return {DbUpdate} DbUpdate constructor
**/
module.exports = new DbUpdate({});