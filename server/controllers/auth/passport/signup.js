var	LocalStrategy = require('passport-local').Strategy;

var	User = require('../../../models/user');
	config = require('../../../config'),
	reCaptcha = require('../../helpers/reCaptcha').Recaptcha;


/**
 * A Passport strategy to register a new user. It checks if the username exists
 * first, and if not then creates the user with the user name and hashes
 * password.
 */
module.exports = function(passport) {
	/* The passport strategy to create a user */
	passport.use('signup', new LocalStrategy({ passReqToCallback : true },

		/* The main function that checks for the user and creates it. */
		function(request, username, password, done) {
			var useCaptcha = (config.reCaptcha ? true : false);

			function findOrCreateUser () {
				/* Find a user in Mongo with provided username */
				User.model.findOne({'username': username}, function(err, user) {
					console.log(err, user);
					if (err) return done(err);

					/* User already exists */
					if (user) return done(null, false, null);

					/* If there is no user with that email, create the user */
					User.create(username, password, function(err, user) {
						if (err) throw err;
						done(null, user);
					});
				});
			}


			/* Check the captcha, which then calls the function to create the
			 * user */
			if(useCaptcha && false) {
				/* Create the reCapthca object */
				var recaptcha = new reCaptcha(
					config.reCaptcha.site,
					config.reCaptcha.secret, {
						'remoteip' : request.connection.remoteAddress,
						'response' : request.body['g-recaptcha-response']
					});

				/* Send it to the google and create the user if successful */
				recaptcha.verify(function (err, success) {
					if(success) findOrCreateUser();
					else done(null, false, null);
				});
			} else { findOrCreateUser(); }
		})
	);
}