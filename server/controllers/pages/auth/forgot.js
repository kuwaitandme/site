var flash = require('connect-flash'),
	mongoose = require('mongoose'),
	passport = require('passport');

var	config = global.config,
	render = require('../../helpers/render'),
	User = global.models.user;


var controller = module.exports = {
	/**
	 * [get description]
	 */
	get: function(request, response, next) {
		render(request, response, {
			bodyid: 'auth-forgot',
			page: 'auth/forgot',
			title: response.__('title.auth.forgot'),

			scripts: ['reCaptcha'],

			data: {
				sitekey: config.reCaptcha.site,
				flashError: request.flash("error")
			}
		});
	},


	/**
	 * [post description]
	 */
	post: function(request, response, next) {
		var captachFail = function(err, res) {
			response.redirect('/auth/forgot?error=captchaFail');
		}

		var captachSuccess = function(err) {
			var email = request.body.email;

			/* Check if email is valid */
			var reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!reEmail.test(email)) return next();

			/* Generate the reset token and send the email */
			User.createResetToken(email, function (err, user) {
				if(err) throw err;
				if(!user) return;

				/* Send reset email */
				Email.sendTemplate(user.email, 'passwdreset', {
					subject: "Reset your password",
					user: user
				});
			});

			/* Redirect to a success page regardless of if the password
			 * reset was sent or not. This makes it harder for a person to
			 * guess if an email is saved in the database or not */
			response.redirect('/auth/login?success=reset_sent');
		}

		/* Check the captcha, which then calls the function to login the
		 * user */
		reCaptcha.verify(request, captachSuccess, captachFail);
	},
}