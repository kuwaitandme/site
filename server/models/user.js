var mongoose = require('mongoose'),
	bCrypt = require('bcrypt-nodejs');

/**
 * Creates a salted hash from the given password.
 */
function createHash(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


var users = module.exports = {
	model: mongoose.model('user', {
		/* Main info */
		username: String,
		password: String,

		/* Admin related settings */
		isAdmin: Boolean,
		language: Number,
		lastLogin: [String],
		status: Number, /* 0:Inactive,1:Active,2:Trusted,3:Banned */
		adminReason: String,

		/* Personal information */
		personal: {
			name: String,
			address: String,
			gender: Number,
			location: Number,
			phone: String,
			website: String,
			email: String,
		}
	}),


	/**
	 * Creates a new user with the given username and password
	 *
	 * @param    String    name      The name of the user.
	 * @param    String    username  The username to create with
	 * @param    String    password  The password to assign to the user.
	 * @param    Function  callback  The callback function to call once done.
	 */
	create: function(name, username, password, callback) {
		/* If there is no user with that email, create the user */
		var newUser = new this.model();

		/* set the user's local credentials */
		newUser.personal.name = name;
		newUser.username = username;
		newUser.email = username;
		newUser.password = createHash(password);

		/* Give defaults to other parameters */
		newUser.isAdmin = false;
		newUser.language = 0;
		newUser.status = 1;

		/* Save and call the callback function */
		newUser.save(function(err) { callback(err, newUser); });
	}
}