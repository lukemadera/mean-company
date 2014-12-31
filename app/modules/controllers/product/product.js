/**
@module product
@class product

@toc
1. search
2. read
3. save
3.1. saveBulk
3.5. saveActual (private function)
4. delete1
5. saveTitle
*/

'use strict';

var Q = require('q');
var lodash = require('lodash');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var CrudMod =require(pathParts.services+'crud/crud.js');
var LookupMod =require(pathParts.services+'lookup/lookup.js');
var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');

var self;

var defaults = {
};

/**
Product module constructor
@class Product
@constructor
@param options {Object} constructor options
**/
function Product(options){
    this.opts = lodash.merge({}, defaults, options||{});

	self = this;
}

/**
@toc 1.
@method search
@param {Object} data
	@param {String} [searchString] Text to search for
	@param {Array} [searchFields =['title']] Fields to search searchString within		//TODO - set default
		@example ['title', 'description']
	@param {Array} [skipIds] _id fields to skip (will be added to query AFTER they are converted to mongo ids (if necessary))
		@example ['324234', '328sakd23', '23lkjafl83']
	@param {Object} [fields ={_id:1, title:1}] Fields to return		//TODO - set default
		@example {_id:1, title:1, priority:1}
	@param {Number} [skip =0] Where to start returning from (like a cursor)
	@param {Number} [limit =20] How many to return
@param {Object} params
@return {Object} (via Promise)
		@param {Number} code
		@param {String} msg
		@param {Array} results
**/
Product.prototype.search = function(db, data, params) {
	var deferred = Q.defer();
	var ret ={code:0, msg:'Product.search ', results:false};

	var defaults ={
		'limit':20,
		'fields':{'_id':1, 'title':1},		//TODO
		'searchFields':['title']		//TODO
	};
	if(data.fields ===undefined) {
		data.fields = defaults.fields;
	}
	if(data.limit ===undefined) {
		data.limit = defaults.limit;
	}
	if(data.searchFields ===undefined) {
		data.searchFields = defaults.searchFields;
	}

	var query ={};
	var ppSend =CrudMod.setSearchParams(data, query, {});
	
	LookupMod.search(db, 'product', ppSend, function(err, ret1) {
		deferred.resolve(ret1);
	});

	return deferred.promise;
};

/**
Reads one or more products
@toc 2.
@method read
@param {Object} data One of '_id' or '_ids' or 'fullQuery' is required
	@param {String} [_id] Id for object to lookup. Will be converted to mongo object id if necessary.
	@param {Array} [_ids] Ids to look up object info on Will be converted to mongo object ids if necessary.
	@param {Object} [fullQuery] Full mongo query to use directly for read
	@param {Array} [fields ={'_id':1, 'title':1}] Mongo query for which fields in the record to return. Use the empty object {} to get all fields.		//TODO - set default
		@example {'_id':1, 'title':1, 'priority':1}
	@param {Object} [query] Additional query for lookup (will be added to the id(s) query).
@param {Object} params
@return {Object} (via Promise)
	@param {Array} results
**/
Product.prototype.read = function(db, data, params) {
	var deferred = Q.defer();
	var ret ={code:0, msg:'Product.read ', results:false};

	var ppSend = {
		'collection':'product'
	};
	if(data._ids !==undefined) {		//for bulk read, return less info
		ppSend.defaults = {
			'fields':{'_id':1, 'title':1}		//TODO
		};
	}
	else if(data.fields !== undefined)
	{
		ppSend.defaults =
		{
			'fields': data.fields
		};
	}
	else
	{
		ppSend.defaults =
		{
			'fields':{}
		};
	}
	CrudMod.read(db, data, ppSend, function(err, ret1) {
		deferred.resolve(ret1);
	});

	return deferred.promise;
};

/**
Creates or updates a product
@toc 3.
@method save
@param {Object} data
	@param {Object} product The data to save. If '_id' field is present, it will update; otherwise it will create
@param {Object} params
	@param {Boolean} [bulk] True if called from bulk call
@return {Object} (via Promise)
	@param {Object} product
**/
Product.prototype.save = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'Product.save ', product:{}};
	
	saveActual(db, data, params)
	.then(function(ret1) {
		deferred.resolve(ret1);
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

/**
Creates or updates multiple products
@toc 3.1.
@method saveBulk
@param {Object} data
	@param {Array} product Array of product objects to save. For each product object, if '_id' field is present, it will update; otherwise it will create
@param {Object} params
@return {Object} (via Promise)
	@param {Array} product Array of product objects
**/
Product.prototype.saveBulk = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'Product.saveBulk ', product:[] };
	
	var ii, dataTemp;
	var promises =[];
	// var deferreds =[];
	for(ii = 0; ii < data.product.length; ii++) {
		//need closure inside for loop
		(function(ii) {
			// deferreds[ii] =Q.defer();		//do it anyway and just immediately resolve for ones that already have _id field
			
			dataTemp ={
				product: data.product[ii]
			};
			promises[ii] =self.save(db, dataTemp, {bulk:true});
			// promises[ii] =deferreds[ii].promise;
		})(ii);
	}
	
	Q.all(promises).then(function(ret1) {
		for(ii =0; ii<ret1.length; ii++) {
			if(ret1[ii].product !==undefined) {
				ret.product[ii] =ret1[ii].product;
			}
			else {
				ret.product[ii] =false;
			}
		}
		deferred.resolve(ret);
	}, function(err) {
		deferred.reject(ret);
	});

	return deferred.promise;
};

/**
@toc 3.5.
@method saveActual
@param {Object} data
	@param {Object} product The data to save. If '_id' field is present, it will update; otherwise it will create
@param {Object} params
	@param {Boolean} [bulk] True if called from bulk call
@return {Object} (via Promise)
	@param {Object} product
*/
function saveActual(db, data, params) {
	var deferred = Q.defer();
	var ret ={code:0, msg:'Product saveActual ', product:{} };
	
	CrudMod.save(db, data.product, {'collection':'product'}, function(err, ret1) {
		ret.msg +=ret1.msg;
		if(ret1.result) { 
			ret.product =ret1.result;
		}
		else {
			ret.product =data.product;
		}
		
		deferred.resolve(ret);
	});
	
	return deferred.promise;
}


/**
Remove one or more products
@toc 4.
@method delete1
@param {Object} data
	@param {String} [product_id] Id of product to delete. one of '_id' or '_ids' is required
	@param {Array} [_ids] Ids of products to delete (will be converted to mongo object ids if necessary). one of '_id' or '_ids' is required
@param {Object} params
@return {Object} (via Promise)
	@param {Object}product
**/
Product.prototype.delete1 = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'Product.delete1 '};

	data._id = data.product_id;
	delete data.product_id;
	
	var ppSend ={
		'collection':'product'
	};
	CrudMod.delete1(db, data, ppSend, function(ret1) {
		deferred.resolve(ret1);
	});

	return deferred.promise;
};

/**
Save a product title
@toc 5.
@method saveTitle
@param {Object} data
	@param {String} _id Id of product to update title for
	@param {String} title Title to save
@param {Object} params
@return {Object} (via Promise)
	@param {Object} product
**/
Product.prototype.saveTitle = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'Product.saveTitle '};

	var idObj =MongoDBMod.makeIds({id:data._id});
	db.product.update({_id: idObj}, { $set: {title: data.title} }, function(err, valid) {
		if(err || !valid) {
			deferred.reject(ret);
		}
		else {
			deferred.resolve(ret);
		}
	});

	return deferred.promise;
};


/**
Module exports
@method exports
@return {Product} Product constructor
**/
module.exports = new Product({});