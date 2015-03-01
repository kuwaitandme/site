var login = require('./login'),
	signup = require('./signup'),
	users = global.models.user;

var controller = module.exports = function(passport){
	/* Passport needs to be able to serialize and deserialize users to support
	 * persistent login sessions */
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done) {
		users.model.findById(id, function(err, user) {
			done(err, user);
		});
	});

	/* Setting up Passport Strategies for Login and SignUp/Registration */
	login(passport);
	signup(passport);
}