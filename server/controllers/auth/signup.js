var render = require('../helpers/render');
var mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var dbConfig = require('../helpers/mongodb'),
	render = require('../helpers/render'),
	crypt = require('../helpers/crypt'),
	Users = require('../../models/users');

/**
 * Controller for the Signup page. Attempts to register the user in.
 *
 * If registration was successful, redirect to the classified posting page so
 * that the user can start posting his/her classified.
 */
module.exports = function(request, response, next) {
	/* Generate the response */
	render(response, {
		bodyid: 'auth-signup',
		page: 'auth/signup',
		title: response.__('title.auth.signup')
	});
}

/* The passport strategy to create a user */
passport.use('signup', new LocalStrategy({
		passReqToCallback : true
	},
  	function(req, username, password, done) {
  		mongoose.connect('localhost', 'kuwaitandme');

		findOrCreateUser = function() {
			console.log("got " + username + ":" + password);

			/* Find a user in Mongo with provided username */
			Users.findOne({'username': username}, function(err, user) {
				console.log(err, user);
				if (err) throw err;

				console.log("User not found");

				/* User already exists */
				if (user) return done(null, false,
				  req.flash('message','User Already Exists'));

				/* If there is no user with that email, create the user */
				var newUser = new Users();

				/* set the user's local credentials */
				newUser.username = username;
				newUser.password = crypt(password);
				newUser.email = req.param('email');
				newUser.firstName = req.param('firstName');
				newUser.lastName = req.param('lastName');

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