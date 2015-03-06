var redis = require('redis'),
	client = redis.createClient(null, null, { detect_buffers: true });

var	category = global.models.category,
	config = global.config;
	externalScripts = require('../helpers/externalScripts'),
	location = global.models.location;


/**
 * A helper function to render the page properly with the right parameters and
 * some default values.
 *
 * @param  response     The reponse to be given to the client
 * @param  args         Arguments to be given to the page
 */
module.exports = function(request, response, args) {
	var common = [];

	/* If the AJAX header is set, then set the response type to JSON and print
	 * out only the main content */
	if(request.headers['x-ajax']) {
		response.contentType('application/json');
		return response.end(JSON.stringify(args.data));
	}

	/* Protect un-initialized variables */
	if(!args.bodyid) args.bodyid = "";
	if(!args.data) args.data = "";
	if(!args.scripts) args.scripts = [];


	/* Load up each of the external scripts */
	for(var i=0; i<args.scripts.length; i++) {
		args.scripts[i] = externalScripts[args.scripts[i]];
	}


	var csrfToken = "";
	if(request.csrfToken) csrfToken = request.csrfToken();

	return response.render("main/" + args.page, {
		bodyid: args.bodyid,
		csrfToken: csrfToken,
		description: args.description,
		externalScripts: args.scripts,
		ga: config.ga,
		title: args.title + " | Kuwait &amp; Me",
		user: request.user,
		jsVersion: config.jsVersion,

		data: args.data,
	});
}