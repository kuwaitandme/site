module.exports = Backbone.View.extend({
	initialize: function() {
		/* Parse the URL and give out the appropriate message based on it. */
		var msg = app.messages;
		var getParam = app.helpers.url.getParam;
		if(getParam('error')) msg.error(this.messages[getParam('error')]);
		if(getParam('success')) msg.success(this.messages[getParam('success')]);
		if(getParam('warn')) msg.warn(this.messages[getParam('warn')]);

		/* Check for any server side flash messages */
		var flashErrors = window.data.flashError;
		if(flashErrors)
			for(var i=0; i<flashErrors.length; i++)
				msg.error(this.messages[flashErrors[i]]);

	},

	messages: {
		activate_fail: 'Something went wrong while activating your account',
		activate_success: 'Your account is successfully activated',
		captchaFail: 'Please enter the captcha properly!',
		incorrect: 'Your login credentials are invalid',
		logout: 'You have been logged out successfully',
		need_login: 'You need to be logged in in to view that page',
		reset_error: 'Something went wrong while resetting your password',
		reset_sent: 'Password reset has been sent to your email',
		send_again: 'Your account is not activated, check your email',
		signup_fail: 'Something went wrong while registering you',
		signup_invalid: 'Some of the fields are invalid',
		signup_success: 'Your account has been created, login below',
		signup_taken: 'That account name has already been taken!'
	}
});