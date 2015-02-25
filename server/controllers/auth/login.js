var flash = require('connect-flash'),
	mongoose = require('mongoose'),
	passport = require('passport');

var	config = require('../../config'),
	render = require('../helpers/render');


/**
 * Controller for the login page. Attempts to log the user in.
 *
 * If successful, redirect to the account page or else stay in the login page
 * and display an error
 */
var controller = module.exports = {
	/* Display the login page */
	get: function(request, response, next) {
		render(request, response, {
			bodyid: 'auth-login',
			page: 'auth/login',
			title: response.__('title.auth.login'),

			scripts: ['reCaptcha'],

			data: {
				sitekey: config.reCaptcha.site,
				flashError: request.flash("error")
			}
		});
	},

	/* On POST request, use passport's authentication mechanism to log the
	 * user in. */
	post: passport.authenticate('login', {
		successRedirect: '/account/',
		failureRedirect: '/auth/login',
		failureFlash: true
	})
}