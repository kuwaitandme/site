var flash = require('connect-flash'),
	mongoose = require('mongoose'),
	passport = require('passport');

var	config = require('../../../var/config'),
	render = require('../helpers/render');


/**
 * Controller for the Signup page. Attempts to register the user in.
 *
 * If registration was successful, redirect to the classified posting page so
 * that the user can start posting his/her classified.
 */
var controller = module.exports = {
	/* Display the signup page */
	get: function(request, response, next) {
		return render(request, response, {
			bodyid: 'auth-signup',
			page: 'auth/signup',
			title: response.__('title.auth.signup'),

			scripts: ['reCaptcha'],

			data: {
				sitekey: config.reCaptcha.site,
				flashError: request.flash("error")
			}
		});
	},

	/* On POST request, use passport's authentication mechanism to register the
	 * user */
	post: passport.authenticate('signup', {
		successRedirect: '/auth/login?success=signup_success',
		failureRedirect: '/auth/signup',
		failureFlash: true
	})
}