module.exports = Backbone.View.extend({
	slug: "page-auth",
	title: "Login",
	// template: Templates["auth.login"],

	/**
	 * Parse the URL and give out the appropriate message based on it.
	 */
	parseURL: function() {
		var msg = app.messages;
		switch(app.helpers.url.getParam("status")) {
			case "logout":
				msg.shout("You have been logged out successfully"); break;
			case "send_again":
				msg.shout("Your account is not activated, check your email"); break;
			case "incorrect":
				msg.shout("Your login credentials are invalid"); break;
			case "registration_successful":
				msg.shout("Success! Login to use your account"); break;
				// msg.shout("Success! Check your email to activate your account"); break;
			case "registration_failure":
				msg.shout("Something went wrong while registering you"); break;
			case "registration_invalid":
				msg.shout("Some of the registration fields are invalid"); break;
			case "activate_success":
				msg.shout("Your account is successfully activated"); break;
			case "activate_fail":
				msg.shout("Something went wrong while activating your account"); break;
			case "reset_sent":
				msg.shout("Password reset has been sent to your email"); break;
			case "reset_error":
				msg.shout("Something went wrong while resetting your email"); break;
			case "adpost_login":
				msg.shout("You need to be logged in to post a classified"); break;
			case "adedit_login":
				msg.shout("You need to be logged in to edit a classified"); break;
		}
	},


	initialize: function() {
		this.parseURL();
	}
});