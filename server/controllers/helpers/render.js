var async = require("async");
var	mysql = require('./mysql');

/**
 * A helper function to render the page properly with the right parameters and
 * some default values.
 *
 * @param  response     The reponse to be given to the client
 * @param  args         Arguments to be given to the page
 * @param  db           The database connection to use if there already is one
 *                      open.
 */
module.exports = function(response, args, db) {
	var closeDB = false;

	var common = [];

	/* Protect un-initialized variables */
	if(!args.bodyid) args.bodyid = "";
	if(!args.data) args.data = "";

	/* Check if any database connection was specified. If no database connection
	 * was specified, so create one */
	if(!db) db = mysql.connect();

	/* Setup data for our asynchronous tasks */
	var tasks = [{
		name: "locations",
		query: "SELECT * FROM location"
	}, {
		name: "categories",
		query: "SELECT * FROM category"
	}];

	/* Function to run on each task setup for the async */
	var asyncJob = function (job, callback) {
		/* Send the query to ther DB */
		db.query(job.query, function (error, rows, fields) {
			/* Save the result in the 'common' variable */
			common[job.name] = rows;

			/* Async call is done, alert via callback */
			callback();
		});
	}

	/**
	 * Function to run once the async is done it's jobs.
	 */
	var asyncComplete = function (error) {
		response.render("main/" + args.page, {
			title: args.title + " | Kuwait &amp; Me",
			user: null,
			bodyid: args.bodyid,
			description: args.description,

			data: args.data,

			categories: common["categories"],
			locations: common["locations"]
		});

		/* Clean up! */
		db.end();
	}

	/* Perform the asynchronous tasks to get the locations and categories */
	async.each(tasks, asyncJob, asyncComplete);
}