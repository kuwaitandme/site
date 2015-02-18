module.exports = Backbone.View.extend({
	initialize: function() {
		this.parseURL();
	},

	/**
	 * Parse the URL and give out the appropriate message based on it.
	 */
	parseURL: function() {
		var msg = app.messages;
		switch(app.helpers.url.getParam("status")) {
			case "signup_failure":
				msg.error("Something went wrong while registering you"); break;
			case "signup_invalid":
				msg.error("Some of the signup fields are invalid"); break;
		}
	},
});