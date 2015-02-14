var bCrypt = require('bcrypt-nodejs'),
	mongoose = require('mongoose'),
	LocalStrategy = require('passport-local').Strategy,
	recaptcha = require('recaptcha-async').reCaptcha();

var	User = require('../../../models/user').model;
	config = require('../../../config');


/**
 * Creates a salted hash from the given password.
 */
function createHash(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


/**
 * A Passport strategy to register a new user. It checks if the username exists
 * first, and if not then creates the user with the user name and hashes
 * password.
 */
module.exports = function(passport) {
	var useCaptcha = (config && config.reCaptcha ? true : false);

	/* The passport strategy to create a user */
	passport.use('signup', new LocalStrategy({ passReqToCallback : true },

		/* The main function that checks for the user and creates it. */
		function(req, username, password, done) {

			/* Set the captcha with it's callback function */
			recaptcha.on('data', function (response) {
				if(response.is_valid) {
					/* Delay the execution of findOrCreateUser and execute
			 		 * the method in the next tick of the event loop */
					process.nextTick(findOrCreateUser);
				} else {
					return done(response.error);
					// return response.redirect('/auth/login?status=captchaFail');
				}
			 });

			function findOrCreateUser() {
				/* Find a user in Mongo with provided username */
				User.findOne({'username': username}, function(err, user) {
					if (err) return done(err);

					/* User already exists */
					if (user) return done(null, false, null);

					/* If there is no user with that email, create the user */
					var newUser = new User();

					/* set the user's local credentials */
					newUser.username = username;
					newUser.password = createHash(password);

					/* save the user */
					newUser.save(function(err) { if (err) throw err; });

					return done(null, newUser);
				});
			}

			/* Check the captcha, which then calls the function to create the
			 * user */
			if(useCaptcha) {
				recaptcha.checkAnswer(config.reCaptcha.secret,
					req.connection.remoteAddress,
					req.body.recaptcha_challenge_field,
					req.body.recaptcha_response_field);
			} else {
				/* Delay the execution of findOrCreateUser and execute
			 	 * the method in the next tick of the event loop */
				process.nextTick(findOrCreateUser);
			}
		})
	);
}