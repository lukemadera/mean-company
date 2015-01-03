'use strict';

var random =require('./random.js');

function httpGo(rpcOpts, httpOpts, params) {
	//http://stackoverflow.com/questions/20518687/angular-e2e-tests-affecting-database
	return browser.executeAsyncScript(function(rpcOpts, httpOpts, params, callback) {
		var appHttp = angular.injector(['myApp']).get('appHttp');
		appHttp.go(rpcOpts, httpOpts, params)
		.then(function(response) {
			callback(response);
		}, function(response) {
			callback(response);
		});
	// }).then(function(output) {
		// return console.log(output);
	// });
	}, rpcOpts, httpOpts, params);
	
	
	/*
	//http://stackoverflow.com/questions/21689089/how-can-i-make-a-post-request-from-a-protractor-test
	return browser.executeAsyncScript(function(callback) {
		var $http =angular.injector(["ng"]).get("$http");
		var data1 ={
			email: 'test1@email.com',
			password: 'pass1',
			first_name: 'first1',
			last_name: 'last1'
		};
		return $http({
			url: "http://localhost:3005/api/auth/create",
			method: "post",
			data: data1,
			dataType: "json"
		}).success(function(data, status) {
			return callback([true, data, status]);
		}).error(function(data, status) {
			return callback([false, data, status]);
		});
		
	}).then(function(data) {
		var success =data[0];
		var response =data[1];
		if(success) {
			console.log(response);
			return console.log("Browser async finished without errors");
		} else {
			return console.log("Browser async finished with errors", response);
		}
	});
	*/
}

var ApiCall =function() {
	/**
	@toc 1.
	@usage
		browser.get('/');		//need to load a page to have angular be defined
		var data1 ={
			email: 'test1@email.com',
			password: 'pass1',
			first_name: 'first1',
			last_name: 'last1'
		};
		apiCall.httpGo({}, {url:'auth/create', data:data1}, {})
		.then(function(response) {
			console.log('RESPONSE');
			console.log(response);
		});
	*/
	this.httpGo =function(rpcOpts, httpOpts, params) {
		return httpGo(rpcOpts, httpOpts, params);
	};
	
	/**
	@toc 2.
	@param {Number} numUsers The number of users to create
	@return {Object}
		@return {Object} result
			@param {Array} users
	*/
	this.userSignupAndLogout =function(numUsers, params) {
		// var $q = angular.injector(['ng']).get('$q');
		// var deferred =$q.defer();
		var deferred =protractor.promise.defer();
		
		var users =[], id1, id2;
		var ii;
		var ns ='e2e';
		for(ii =0; ii<numUsers; ii++) {
			id1 =random.string1(10, {});
			id2 =random.string1(10, {});
			users[ii] ={
				first_name: ns+id1,
				last_name: ns+id2,
				email: 'e2e_'+id1+'_'+id2+'@e2e.com',
				password: 'e2e'+id1
			};
		}
		
		// return browser.executeAsyncScript(function(params, user1, callback) {
			httpGo({}, {url:'e2eMocks/userSignupAndLogout', data:{users:users}}, {})
			.then(function(ret1) {
				//pass back plain text version of password as well since need that to login!
				// ret1.result.user._password_plain_text =user1.password;
				var jj;
				for(ii =0; ii<ret1.result.users.length; ii++) {
					for(jj =0; jj<users.length; jj++) {
						if(ret1.result.users[ii].first_name ==users[jj].first_name) {		//assume first_name is unique!
							ret1.result.users[ii]._password_plain_text =users[jj].password;
							break;
						}
					}
				}
				
				// callback(ret1);
				// deferred.resolve(ret1);
				deferred.fulfill(ret1);
			}, function(retErr) {
				// callback(retErr);
				deferred.reject(retErr);
			});
		// }, params, user1);
		
		return deferred.promise;
	};
	
	/**
	@toc 3.
	*/
	this.userDelete =function(userIds, params) {
		return httpGo({}, {url:'e2eMocks/userDelete', data:{_ids:userIds}}, {});
	};
	
	/**
	@toc 4.
	@param {Object} data
		@param {Array} user_ids Ids of users to delete merchants for (will be converted to mongo object ids if necessary).
		@param {Number} [delete_products =0] 1 To ALSO delete all products of all merchants
	*/
	this.userMerchantDelete =function(data, params) {
		return httpGo({}, {url:'e2eMocks/userMerchantDelete', data:data}, {});
	};
};

module.exports = new ApiCall();