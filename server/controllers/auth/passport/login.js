var bCrypt = require('bcrypt-nodejs'),
	LocalStrategy = require('passport-local').Strategy;

var	User = require('../../../models/user').model;
	reCaptcha = require('../../helpers/reCaptcha');


/**
 * Checks if the given username and password are valid or not.
 */
function isValidPassword(user, password){
	return bCrypt.compareSync(password, user.password);
}


/**
 * Registers a passport strategy to authenticate a user into the backend.
 */
var controller = module.exports = function(passport) {
	passport.use('login', new LocalStrategy({ passReqToCallback : true },
		/**
		 * The main function that validates the username and password
		 */
		function(request, username, password, done) {

			/* Validate the username & password */
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!re.test(username) || !password)
				return done(null, false, { message: "badlogin" });

			var captachFail = function(err, response) {
				done(null, false, { message: "captchaFail" });
			}

			var captachSuccess = function(err) {
				/* Check in Mongo if a user with username exists or not */
				User.findOne({ 'username' :	username }, function(err, user) {
					if (err) return done(err);

					/* Username does not exist or User exists but wrong
					 * password */
					if (!user || !isValidPassword(user, password))
						return done(null, false, { message: "incorrect" });


					/* User and password both match, return user from
					 * done method which will be treated like success */
					return done(null, user);
				});
			}

			/* Check the captcha, which then calls the function to login the
			 * user */
			reCaptcha.verify(request, captachSuccess, captachFail);
		})
	);
}