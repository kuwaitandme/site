var mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var	render = require('../helpers/render');


/**
 * Controller for the Signup page. Attempts to register the user in.
 *
 * If registration was successful, redirect to the classified posting page so
 * that the user can start posting his/her classified.
 */
module.exports = {
	/* Display the signup page */
	get: function(request, response, next) {
		return render(request, response, {
			bodyid: 'auth-signup',
			page: 'auth/signup',
			title: response.__('title.auth.signup'),
			data: {
				sitekey: '6LcTDQITAAAAADq3-8i6A_YIwuAbpzq9dHJceSem'
			}
		});
	},

	/* On POST request, use passport's authentication mechanism to register the
	 * user */
	post: passport.authenticate('signup', {
		successRedirect: '/auth/login',
		failureRedirect: '/auth/signup'
	})
}