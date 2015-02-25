var classifiedPost = require("./classified.post");

module.exports = classifiedPost.extend({

	/**
	 *
	 * @param  {[type]} response [description]
	 * @return {[type]}          [description]
	 */
	ajaxSuccess: function(response) {
		/* Create the finish URL */
		var href = "/guest/finish/" + response.id + "?authHash=" + response.authHash;

		/* Redirect to this URL */
		window.location.href = href;
	},
});