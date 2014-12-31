/**
@fileOverview

@toc
//public
*/

'use strict';

var CronJob = require('cron').CronJob;

var self;

/**
@param {Object} opts
*/
function Cron(opts) {
	self =this;
}


Cron.prototype.testRun =function(params) {
	new CronJob('* * * * * *', function(){
		console.log('You will see this message every second');
	}, null, true, "");
};

module.exports = new Cron({});