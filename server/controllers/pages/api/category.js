var async = require("async"),
	redis = require('redis'),
	client = redis.createClient(null, null, { detect_buffers: true });

var	category = global.models.category,
	classified = global.models.classified,
	config = global.config;


var controller = module.exports = {

	/**
	 * [get description]
	 */
	get: function(request, response, next) {
		response.contentType('application/json');

		/* Function to run once the async is done it's jobs. */
		var asyncComplete = function (err, results) {
			if(err) throw err;
			response.end(JSON.stringify(results));
		}

		/* Perform the asynchronous tasks to get the categories and the count */
		async.parallel({
			categories: function(finish) {
				client.get("categories", function (err, result) {
					if (result)return finish(err, result);

					category.getAll(function(result) {
						var json = JSON.stringify(result);
						client.set("categories", json);
						finish(null, result);
					});
				});
			},
			count: function(finish) {
				client.get("categoriescount", function (err, result) {
					if (result) return finish(err, result);

					classified.classifiedsPerCategory(function (result) {
						var json = JSON.stringify(result);
						client.set("categoriescount", json);
						finish(null, result);
					});
				});
			}
		}, asyncComplete);
	}
}