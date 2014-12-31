/**
Tests for all /api/product endpoints

NOTE: "it" blocks with modularized/nested function and async code can be finicky - I don't think nested "it" blocks are allowed BUT need an outer "it" block to ensure the async code gets run (otherwise it will just complete immediately before running any tests). So if and when to use "done" for the it blocks and where to put them is sometimes hard to follow/trace. When in doubt, try an "it" block and if it errors or doesn't complete, try just putting an "expect" there directly - it's likely already in an "it" block..

@toc
public methods
1. Product
2. Product.run
private methods
3.5. clearData
3. before
4. after
5. go
	6. save
	6.1. saveBulk
	6.2. saveUpdate
	7. read
	8. search
	9. delete1
*/

'use strict';

var https = require("https");
var request = require('request');
var async = require('async');
var lodash = require('lodash');
var Q = require('q');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');

var self, db, api;

//NOTE: make sure to namespace all values to ensure no conflicts with other modules that run asynchronously and may be altering the same data otherwise - leading to odd and very hard to debug errors..
//NOTE: make sure to namespace all values to ensure no conflicts with other modules that run asynchronously and may be altering the same data otherwise - leading to odd and very hard to debug errors..
var ns ='product_';		//namespace
var TEST_PRODUCT =[
	{
		title: ns+'title1'		//TODO
	},
	{
		title: ns+'title2'		//TODO
	},
	{
		title: ns+'TiTle 3'		//TODO
	},
	{
		title: ns+'titLe 4'		//TODO
	}
];

/**
Variable to store variables we need to use in multiple tests (i.e. counters)
@property globals
@type Object
*/
var globals ={
	numSaveBulk: 2		//number of inserts/documents saved via the bulk call
};

module.exports = Product;

/**
Main function/object (will be exported)
@toc 1.
@method Product
@param {Object} params
	@param {Object} db
	@param {Object} api
	// @param {Object} MongoDBMod
*/
function Product(params) {
	db =params.db;
	api =params.api;
	// MongoDBMod =params.MongoDBMod;
	
	self =this;
}

/**
@toc 2.
@method Product.run
@param {Object} params
*/
Product.prototype.run =function(params) {
	var deferred =Q.defer();
	
	describe('ProductModule', function() {
		it("should test all product calls", function(done)
		{
			var promise =before({});
			promise.then(function(ret1) {
				done();
				deferred.resolve(ret1);
			}, function(err) {
				deferred.reject(err);
			});
		});
	});
	
	return deferred.promise;
};

/**
@toc 3.5.
@method clearData
@param {Object} params
@return {Promise} This will ALWAYS resolve (no reject)
*/
function clearData(params) {
	var deferred =Q.defer();
	var ret ={msg: ''};
	
	//drop test data
	var titles =[];		//TODO
	var ii;
	for(ii =0; ii<TEST_PRODUCT.length; ii++) {
		titles[ii] =TEST_PRODUCT[ii].title;		//TODO
	}
	db.product.remove({title: {$in:titles} }, function(err, numRemoved) {		//TODO
		if(err) {
			ret.msg +="db.product.remove Error: "+err;
		}
		else if(numRemoved <1) {
			ret.msg +="db.product.remove Num removed: "+numRemoved;
		}
		else {
			ret.msg +="db.product.remove Removed "+numRemoved;
		}
		
		deferred.resolve(ret);
		
	});
	
	return deferred.promise;
}

/**
@toc 3.
@method before
@param {Object} params
*/
function before(params) {
	var deferred =Q.defer();
	
	var promiseClearData =clearData({})
	.then(function(ret1) {
		console.log('\nProduct BEFORE: '+ret1.msg);

		var promise =go({});
		promise.then(function(ret1) {
			var promiseAfter =after({});
			promiseAfter.then(function(retAfter) {
				deferred.resolve(ret1);
			}, function(err) {
				deferred.reject(err);
			});
		}, function(err) {
			deferred.reject(err);
		});
	});

	return deferred.promise;
}

/**
Do clean up to put database back to original state it was before ran tests (remove test data, etc.)
@toc 4.
@method after
@param {Object} params
*/
function after(params) {
	var deferred =Q.defer();
	
	var promiseClearData =clearData({})
	.then(function(ret1) {
		console.log('\nProduct AFTER: '+ret1.msg);
		deferred.resolve({});
	});
	
	return deferred.promise;
}

/**
@toc 5.
@method go
@param {Object} params
*/
function go(params) {
	var deferred =Q.defer();
	var reqObj;
	
	/**
	Tests both save AND saveBulk (via function call) calls
	@toc 6.
	@method save
	@param {Object} opts
	*/
	var save =function(opts) {
		var promises =[], ii, params, deferreds =[];
		var data;
		var numBulk =globals.numSaveBulk;
		var ProductBulk =TEST_PRODUCT.slice(0, numBulk);
		var ProductNonBulk =TEST_PRODUCT.slice(numBulk, TEST_PRODUCT.length);
		
		//non bulked
		for(ii =0; ii<ProductNonBulk.length; ii++) {
			(function(ii) {
				deferreds[ii] =Q.defer();
				params ={
					product: ProductNonBulk[ii]
				};
				api.expectRequest({method:'Product.save'}, {data:params}, {}, {})
				.then(function(res) {
					data =res.data.result;
					expect(data.product.title).toEqual(ProductNonBulk[ii].title);		//TODO
					TEST_PRODUCT[(ii+numBulk)]._id =data.product._id;		//save for use later
					deferreds[ii].resolve({});
				});
				
				promises[ii] =deferreds[ii].promise;
			})(ii);
		}
		
		//once non-bulk promises are all done
		Q.all(promises).then(function(ret1) {
			saveBulk({});
		}, function(err) {
			saveBulk({});
		});
	};
	
	/**
	@toc 6.1.
	@method saveBulk
	@param {Object} opts
	*/
	var saveBulk =function(opts) {
		var ii, params;
		var data;
		var numBulk =globals.numSaveBulk;
		var ProductBulk =TEST_PRODUCT.slice(0, numBulk);
		var ProductNonBulk =TEST_PRODUCT.slice(numBulk, TEST_PRODUCT.length);
		
		//bulked
		params ={
			product: ProductBulk
		};
		api.expectRequest({method:'Product.saveBulk'}, {data:params}, {}, {})
		.then(function(res) {
			data =res.data.result;
			for(ii =0; ii<ProductBulk.length; ii++) {
				expect(data.product[ii].title).toEqual(ProductBulk[ii].title);		//TODO
				expect(data.product[ii]._id).toBeDefined();
				TEST_PRODUCT[ii]._id =data.product[ii]._id;		//save for use later
			}
			saveUpdate({});
		});
	};
	
	
	/**
	@toc 6.2.
	@method saveUpdate
	@param {Object} opts
	*/
	var saveUpdate =function(opts) {
		TEST_PRODUCT[0].title ='product new title';		//TODO - update a field to save
		var params =
		{
			product: TEST_PRODUCT[0]
		};
		api.expectRequest({method:'Product.save'}, {data:params}, {}, {})
		.then(function(res) {
			var data =res.data.result;
			read({});		//go to next function/test in sequence
		});
	};
	
	/**
	@toc 7.
	@method read
	@param {Object} opts
	*/
	var read =function(opts) {
		var params ={
			_id: TEST_PRODUCT[0]._id
		};
		api.expectRequest({method:'Product.read'}, {data:params}, {}, {})
		.then(function(res) {
			var data =res.data.result;
			expect(data.result).toBeDefined();
			expect(data.result.title).toBe(TEST_PRODUCT[0].title);		//TODO
			search({});
		});
	};
	
	/**
	@toc 8.
	@method search
	@param {Object} opts
	*/
	var search =function(opts) {
		//should return all products with no search query entered
		var params ={
		};
		api.expectRequest({method:'Product.search'}, {data:params}, {}, {})
		.then(function(res) {
			var data =res.data.result;
			expect(data.results.length).toBe(TEST_PRODUCT.length);
			
			//should return the matched set of products with a search
			var params ={
				//TODO
				searchString: 'titLe',		//should be case-insensitive
				searchFields: ['title']
				//end: TODO
			};
			api.expectRequest({method:'Product.search'}, {data:params}, {}, {})
			.then(function(res) {
				var data =res.data.result;
				expect(data.results.length).toBe(4);		//TODO
				
				var params ={
					//TODO
					searchString: 'title2',		//do NOT use first [0] item as that was updated/changed via the saveUpdate function!
					searchFields: ['title']
					//end: TODO
				};
				api.expectRequest({method:'Product.search'}, {data:params}, {}, {})
				.then(function(res) {
					var data =res.data.result;
					expect(data.results.length).toBe(1);		//TODO
					
					delete1({});		//go to next function/test in sequence
				});
			});
		});
	};
	
	/**
	@toc 9.
	@method delete1
	@param {Object} opts
	*/
	var delete1 =function(opts) {
		var params ={};
		//should delete a product
		params ={
			product_id: TEST_PRODUCT[0]._id
		};
		api.expectRequest({method:'Product.delete1'}, {data:params}, {}, {})
		.then(function(res) {
			var data =res.data.result;
			
			//search now to confirm delete happened properly
			params ={
			};
			api.expectRequest({method:'Product.search'}, {data:params}, {}, {})
			.then(function(res) {
				var data =res.data.result;
				expect(data.results.length).toBe((TEST_PRODUCT.length-1));		//should be 1 less now that deleted one
				
				//should delete multiple products
				params ={
					_ids: [TEST_PRODUCT[1]._id, TEST_PRODUCT[2]._id]
				};
				api.expectRequest({method:'Product.delete1'}, {data:params}, {}, {})
				.then(function(res) {
					var data =res.data.result;
				
					//search now to confirm delete happened properly
					params ={
					};
					
					api.expectRequest({method:'Product.search'}, {data:params}, {}, {})
					.then(function(res) {
						var data =res.data.result;
						expect(data.results.length).toBe((TEST_PRODUCT.length-1-2));		//should be 1 less now that deleted ones
						
						deferred.resolve({});
					});
					
				});
			
			});
		});
	};
	
	save({});		//start all the calls going
	
	return deferred.promise;
}