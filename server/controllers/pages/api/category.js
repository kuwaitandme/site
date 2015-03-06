var config = global.config;

var controller = module.exports = {
	/**
	 * [get description]
	 */
	get: function(request, response, next) {
		response.contentType('application/json');
		response.end(JSON.stringify({
			author : "Steven Enamakel",
			status : "online",
			jsVersion: config.jsVersion,
		}));
	}
}