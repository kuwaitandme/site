var bCrypt = require('bcrypt-nodejs'),
	mongoose = require('mongoose'),
	LocalStrategy = require('passport-local').Strategy;

var User = require('../../../models/user').model;


/**
 * Checks if the given username and password are valid or not.
 */
function isValidPassword(user, password){
	return bCrypt.compareSync(password, user.password);
}


/**
 * Registers a passport strategy to authenticate a user into the backend.
 */
module.exports = function(passport) {
	passport.use('login', new LocalStrategy({ passReqToCallback : true },
		/**
		 * The main function that validates the username and password
		 */
		function(req, username, password, done) {

			/* Check in mongo if a user with username exists or not */
			User.findOne({ 'username' :	username }, function(err, user) {
				if (err) return done(err);

				/* Username does not exist or User exists but wrong
				 * password */
				if (!user || !isValidPassword(user, password))
					return done(null, false, null);


				/* User and password both match, return user from
				 * done method which will be treated like success */
				return done(null, user);
			});
		})
	);
}