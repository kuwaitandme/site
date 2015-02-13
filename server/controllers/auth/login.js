var mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var	render = require('../helpers/render');


/**
 * Controller for the login page. Attempts to log the user in.
 *
 * If successful, redirect to the account page or else stay in the login page
 * and display an error
 */
module.exports = function(request, response, next) {
	/* Generate the response */
	render(request, response, {
		bodyid: 'auth-login',
		page: 'auth/login',
		title: response.__('title.auth.login')
	});
}