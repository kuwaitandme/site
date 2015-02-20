var async = require("async");
	redis = require('redis'),
	client = redis.createClient(null, null, { detect_buffers: true });

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
	var asyncJob = function (job, finish) {
		/* Check the redis DB to see if our queries are cached or not */
		client.get(job.name, function (err, result) {
			if (result) {
				common[job.name] = JSON.parse(result);

				return finish();
			}

			/* If we reach here, then the query was not cached. Execute the
			 * query and cache it for next time */
			job.model.getAll(function(result) {
				common[job.name] = result;

				var json = JSON.stringify(result);
				client.set(job.name, json);

				finish();
			});
		});
	}

	/* Load up each of the external scripts */
	for(var i=0; i<args.scripts.length; i++) {
		args.scripts[i] = externalScripts[args.scripts[i]];
	}

	/* Function to run once the async is done it's jobs. */
	var asyncComplete = function (err) {
		if(err) throw err;

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