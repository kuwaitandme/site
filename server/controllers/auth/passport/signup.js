var bCrypt = require('bcrypt-nodejs'),
	mongoose = require('mongoose'),
	LocalStrategy = require('passport-local').Strategy;

var	crypt = require('../../helpers/crypt'),
	dbConfig = require('../../helpers/mongodb'),
	Users = require('../../../models/users').model;


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
	/* The passport strategy to create a user */
	passport.use('signup', new LocalStrategy({ passReqToCallback : true },

		/**
		 * The main function that checks for the user and creates it.
		 */
		function(req, username, password, done) {
			mongoose.connect(dbConfig.url);

			findOrCreateUser = function() {
				/* Find a user in Mongo with provided username */
				Users.findOne({'username': username}, function(err, user) {
					if (err) return done(err);

					/* User already exists */
					if (user) return done(null, false, null);

					/* If there is no user with that email, create the user */
					var newUser = new Users();

					/* set the user's local credentials */
					newUser.username = username;
					newUser.password = createHash(password);

					/* save the user */
					newUser.save(function(err) { if (err) throw err; });

					return done(null, newUser);
				});
			}

			/* Delay the execution of findOrCreateUser and execute
			 * the method in the next tick of the event loop */
			process.nextTick(findOrCreateUser);
		})
	);
}