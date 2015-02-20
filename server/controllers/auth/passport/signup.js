var	LocalStrategy = require('passport-local').Strategy;

var	User = require('../../../models/user'),
	reCaptcha = require('../../helpers/reCaptcha');


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
			var captachFail = function() {
				done(null, false, { message: "captchaFail" });
			}

			var captachSuccess = function() {
				/* Find a user in Mongo with provided username */
				User.model.findOne({'username': username}, function(err, user) {
					if (err) return done(err, false);

					/* User already exists */
					if (user) return done(null, false, { message: "signup_taken" });

					/* If there is no user with that email, create the user */
					User.create(username, password, function(err, user) {
						if (err) throw err;
						done(null, user);
					});
				});
			}

			/* Check the captcha, which then calls the function to create the
			 * user */
			reCaptcha.verify(request, captachSuccess, captachFail);
		}
	));
}