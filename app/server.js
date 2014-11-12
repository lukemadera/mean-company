/**
Configures express server and glues application together.

When initialized this file sets up the following modules:

- Express server
- MongoDB database connection
- JSON-RPC API
- All non-API routes

Server module
@module server
**/

'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var errorhandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var http    = require('http');
var https   = require('https');
var fs      = require('fs');
var lodash       = require('lodash');
var Q = require('q');

// session store
// var MongoStore  = require('connect-mongo')(express);
// database interface
var mongodb    = require('mongodb');

var Database = require('./database');

var dependency =require('./dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

//site-specific
var io;
var RealtimeMod =require(pathParts.services+'realtime/realtime.js');

var self;

// CORS support middleware factory
var allowCors = function(domains){
    if(lodash.isString(domains)){
        domains = [ domains ];
    }

    var allowAll = lodash.contains(domains, '*');

    // return CORS middleware bound to domains arg
    return function(req, res, next){
        // @note: can only send a single Access-Control-Allow-Origin header per spec
        //  thus, have to compare incoming origin with list of allowed domains and respond with that origin in header
        var origin = req.get('Origin');
		
		var optionsSent =false;		//can't res.send AND do next() otherwise get an error about headers already being sent so need to set a flag so only send one or the other
		
		// console.log('domains: '+JSON.stringify(domains)+' origin: '+origin);
		var allowedDomain =false;
		// allowedDomain =lodash.contains(domains, origin);		//doesn't work since origin can be 'http://localhost' and then 'localhost' as a domain will NOT be a match. Basically need to account for subdomains, host, etc. in the string
		if(origin !==undefined) {
			var ii;
			for(ii =0; ii<domains.length; ii++) {
				if(origin.indexOf(domains[ii]) >-1) {
					allowedDomain =true;
					break;
				}
			}
		}

        // check if origin is in allowed domains
        if( allowAll || allowedDomain ){
            // send appropriate CORS headers
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

            // intercept OPTIONS method for preflight response
            if(req.method === 'OPTIONS'){
				optionsSent =true;
                res.send(200);
            }
        }

		if(!optionsSent) {
			next();
		}
    };
};

module.exports = Server;

/**
Express Server class
@class Server
@constructor
@param cfg {Object} JSON configuration file
**/
function Server(cfg){
	self =this;
	var deferred = Q.defer();
	var thisObj =this;
    this.env = cfg.env;
    this.cfg = cfg;

	// console.log('cfg json: '+JSON.stringify(cfg));
	// Connect to database
	// var db =new Database(cfg.db).db;
    var promise =new Database(cfg.db);
	promise.then(function(db) {
		var expressApp = thisObj.configure(cfg, db);

		// set variables here instead of in configure() so it's clear what our attributes are
		thisObj.app = expressApp.app;
		thisObj.server = expressApp.server;
		thisObj.db = expressApp.db;
		if(expressApp.httpApp !==undefined && expressApp.httpServer !==undefined) {
			thisObj.httpApp = expressApp.httpPpp;
			thisObj.httpServer = expressApp.httpServer;
		}
		
		//site-specific
		//set up realtime
		var paramsRealtime ={
			db: db
		};
		if(cfg.server.socketIOEnabled) {
			paramsRealtime.io =io;
		}
		RealtimeMod =RealtimeMod.init(paramsRealtime);
		
		deferred.resolve(thisObj);
	}, function(err) {
		console.log('error: '+err);
		deferred.reject(err);
	});
	
	return deferred.promise;
}

/**
Configure the express server and all it's components
@method configure
@param cfg {Object} JSON configuration object
**/
Server.prototype.configure = function(cfg, db){
    /** Configuration **/
    var env = cfg.env;

    // create main app/server
    var app = express();
    var server;
	var httpApp =false, httpServer =false;

    if( cfg.ssl.enabled ){
		//create http version too for redirect to https
		httpApp =express();
		httpServer = http.createServer(httpApp);
		
        var opts ={
            key:    fs.readFileSync(__dirname+cfg.ssl.key),
            cert:   fs.readFileSync(__dirname+cfg.ssl.cert)
        };
        if(cfg.ssl.ca !==undefined && cfg.ssl.ca.length >0) {
            opts.ca =[];
            var ss;
            for(ss =0; ss<cfg.ssl.ca.length; ss++) {
                opts.ca.push(fs.readFileSync(__dirname+cfg.ssl.ca[ss]));
            }
        }
        server = https.createServer(opts, app);
    } else {
        server = http.createServer(app);
    }
	if(cfg.server.socketIOEnabled) {
		io =require('socket.io');
		io =io.listen(server);		//it's important to update / re-set io to io.listen!! otherwise all future function calls on io will be referencing the wrong object and will not work!
	}

    var staticFilePath = __dirname + cfg.server.staticFilePath;
    // remove trailing slash if present
    if(staticFilePath.substr(-1) === '/'){
        staticFilePath = staticFilePath.substr(0, staticFilePath.length - 1);
    }

    // configure express
	app.use(morgan(cfg.logKey));

	// compress static content
	app.use(compression());
	app.use(cfg.server.staticPath, express.static(staticFilePath));

	app.use(bodyParser());
	// app.use(express.query());		//not sure how to replace this for express 4.0 or if it's even necessary in the first place - https://github.com/senchalabs/connect#middleware
	app.use(methodOverride());
	app.use(cookieParser(cfg.cookie.secret));

	// allow cors
	if( cfg.cors && cfg.cors.domains ){
		app.use( allowCors(cfg.cors.domains) );
	}

	// app.use(app.router);			//deprecated in express 4.x

    // set app settings variables
    app.set('db.database', cfg.db.database);
    app.set('server.port', cfg.server.port);
    app.set('staticFilePath', staticFilePath);

	// load api
	app.use( require('./routes/api')(cfg, server, db) );

	// load routes (must be loaded after API since routes may contain catch-all route)
	app.use( require('./routes')(cfg) );

    var ret ={
        app: app,
        server: server,
        db: db
	};
	if(httpApp && httpServer) {
		//redirect all http requests to https
		httpApp.get('*',function(req,res){
			console.log('httpApp redirect (to https)');
			var url1 =self.cfg.server.scheme+'://'+self.cfg.server.domain;
			if(self.cfg.server.httpRedirectPort !==undefined) {
				if(self.cfg.server.httpRedirectPort) {		//only add port if set; if false want NO port
					url1 +=':'+self.cfg.server.httpRedirectPort.toString();
				}
			}
			else {		//just use normal port
				url1 +=':'+self.cfg.server.port.toString();
			}
			url1 +=req.url;
			// self.cfg.server.scheme+'://'+self.cfg.server.domain+':'+self.cfg.server.port.toString()+req.url
			res.redirect(url1);
		});

		ret.httpApp =httpApp;
		ret.httpServer =httpServer;
	}
	
	//put this at the end for express 4.x? - https://github.com/visionmedia/express/wiki/Migrating-from-3.x-to-4.x
	// set error handling
    if(cfg.env === 'development'){
        app.use(errorhandler({ dumpExceptions: true, showStack: true }));
    } else {
        app.use(errorhandler());
    }
	
    return ret;
};

/**
Default listen callback function after server starts listening. Used when nothing passed to listen().
@method defaultListenCallback
@param port {Integer} server port to listen on
@parm env {String} runtime environment (e.g. 'development', 'production')
**/
Server.prototype.defaultListenCallback = function(port, env){
	var loc1 =self.cfg.server.scheme+'://'+self.cfg.server.domain+':'+port.toString()+'/';
    console.log('Express server listening at '+loc1+' in '+env+' mode');
};

/**
Starts server listening
@method listen
@param [callback] {Function} listen callback function
**/
Server.prototype.listen = function(callback){
    // var port = this.cfg.server.port;
	var port = process.env.PORT || this.cfg.server.port;		//for Heroku to work
    var env = this.env;

    callback = callback || this.defaultListenCallback;

    this.server.listen(port, function(){
        callback(port, env);
    });
	
	if(this.httpServer !==undefined && this.cfg.server.httpPort !==undefined && this.cfg.server.httpPort) {
		this.httpServer.listen(this.cfg.server.httpPort);
	}
};

