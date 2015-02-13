var bCrypt = require('bcrypt-nodejs'),
	mongoose = require('mongoose'),
	LocalStrategy = require('passport-local').Strategy;
var Users = require('../../../models/users').model,
	crypt = require('../../helpers/crypt');

module.exports = function(passport) {
	/* The passport strategy to create a user */
	passport.use('signup', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) {
			mongoose.connect('localhost', 'kuwaitandme');

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

var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}