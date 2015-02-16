var async = require("async");
var	category = require('../../models/category'),
	externalScripts = require('../helpers/externalScripts'),
	location = require('../../models/location');


/**
 * A helper function to render the page properly with the right parameters and
 * some default values.
 *
 * @param  response     The reponse to be given to the client
 * @param  args         Arguments to be given to the page
 */
module.exports = function(request, response, args) {
	var common = [];

	/* Protect un-initialized variables */
	if(!args.bodyid) args.bodyid = "";
	if(!args.data) args.data = "";
	if(!args.scripts) args.scripts = [];

	/* Setup data for our asynchronous tasks */
	var tasks = [{
			model: category,
			name: "categories"
		},{
			model: location,
			name: "locations"
		}
	];

	/* Function to run on each task setup for the async */
	var asyncJob = function (job, callback) {
		job.model.getAll(function(result) {
			common[job.name] = result;

			/* Async call is done, alert via callback */
			callback();
		});
	}

	/* Load up each of the external scripts */
	for(var i=0; i<args.scripts.length; i++) {
		args.scripts[i] = externalScripts[args.scripts[i]];
	}

	/* Function to run once the async is done it's jobs. */
	var asyncComplete = function (error) {
		return response.render("main/" + args.page, {
			bodyid: args.bodyid,
			description: args.description,
			externalScripts: args.scripts,
			title: args.title + " | Kuwait &amp; Me",
			user: request.user,

			data: args.data,

			categories: common["categories"],
			locations: common["locations"]
		});
	}

	/* Perform the asynchronous tasks to get the locations and categories */
	return async.each(tasks, asyncJob, asyncComplete);
}