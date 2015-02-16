var mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var	render = require('../helpers/render'),
	config = require('../../config');


/**
 * Controller for the login page. Attempts to log the user in.
 *
 * If successful, redirect to the account page or else stay in the login page
 * and display an error
 */
module.exports = {
	/* Display the login page */
	get: function(request, response, next) {
		return render(request, response, {
			bodyid: 'auth-login',
			page: 'auth/login',
			title: response.__('title.auth.login'),
			data: {
				sitekey: config.reCaptcha.site
			}
		});
	},

	/* On POST request, use passport's authentication mechanism to log the
	 * user in. */
	post: passport.authenticate('login', {
		successRedirect: '/account/',
		failureRedirect: '/auth/login'
	})
}