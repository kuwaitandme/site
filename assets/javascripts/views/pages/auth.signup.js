module.exports = Backbone.View.extend({
	slug: "page-auth",
	title: "Sign-up",
	// template: Templates["auth.signup"],

	/**
	 * Parse the URL and give out the appropriate message based on it.
	 */
	parseURL: function() {
		var msg = app.messages;
		switch(app.helpers.url.getParam("status")) {
			case "registration_successful":
				msg.shout("Success! Login to use your account"); break;
				// msg.shout("Success! Check your email to activate your account"); break;
			case "registration_failure":
				msg.shout("Something went wrong while registering you"); break;
			case "registration_invalid":
				msg.shout("Some of the registration fields are invalid"); break;
		}
	},

	render: function() {
		this.$el.html(this.template());
		this.parseURL();
	},
});