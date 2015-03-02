var	config = global.config,
	render = require('../../helpers/render'),
	User = global.models.user;


var controller = module.exports = {
	/**
	 * [get description]
	 */
	get: function(request, response, next) {
		var id = request.params.id;
		var resetToken = request.query.token || "";

		/* Clean out the parameters */
		if(resetToken.length != 24 || !/^[0-9A-F]*$/i.test(id)) return next();

		render(request, response, {
			bodyid: 'auth-reset',
			page: 'auth/reset',
			title: response.__('title.auth.reset'),

			scripts: ['reCaptcha'],

			data: {
				sitekey: config.reCaptcha.site,
			}
		});
	},


	/**
	 * [post description]
	 */
	post: function(request, response, next) {
		var id = request.params.id;
		var resetToken = request.query.token || "";

		var captachFail = function(err, res) {
			response.redirect('/auth/reset/' + id + '?token='
				+ resetToken + '&error=captchafail');
		}

		var captachSuccess = function(err) {
			var password = request.body.password;
			var repassword = request.body.repassword;

			/* Clean out the parameters */
			if(resetToken.length != 24 || !/^[0-9A-F]*$/i.test(id)) return next();

			/* Check if passwords match */
			if(password != repassword)
				return response.redirect('/auth/reset/' + id + '?token='
					+ resetToken + '&error=reset_password_mismatch');

			/* Check if password is too small */
			if(password.length < 5)
				return response.redirect('/auth/reset/' + id + '?token='
					+ resetToken + '&error=reset_password_small');

			/* Reset the password! */
			User.resetPassword(id, resetToken, password, function (err, success) {
				if(err) throw err;

				if(!success) response.redirect('/auth/login?error=reset_fail');
				else response.redirect('/auth/login?success=reset_success');
			});
		}

		/* Check the captcha, which then calls the function to login the
		 * user */
		reCaptcha.verify(request, captachSuccess, captachFail);
	},
}