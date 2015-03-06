var	redis = require('redis'),
	client = redis.createClient(null, null, { detect_buffers: true });

var	category = global.models.category,
	config = global.config;


var controller = module.exports = {

	/**
	 * [get description]
	 */
	get: function(request, response, next) {
		response.contentType('application/json');

		/* Check the redis DB to see if our queries are cached or not */
		client.get("categories", function (err, result) {
			if (result)
				return response.end(JSON.stringify(result));

			/* If we reach here, then the query was not cached. Execute the
			 * query and cache it for next time */
			category.getAll(function(result) {
				var json = JSON.stringify(result);
				client.set("categories", json);

				response.end(json);
			});
		});
	}
}