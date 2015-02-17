var mongoose = require('mongoose'),
	bCrypt = require('bcrypt-nodejs');

/**
 * Creates a salted hash from the given password.
 */
function createHash(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


module.exports = {
	model: mongoose.model('user', {
		username: String,
		password: String,
		loginEmail: String,

		isAdmin: Boolean,
		language: Number,
		lastLogin: [String],
		status: Number, /* 0:Inactive,1:Active,2:Trusted,3:Banned */
		adminReason: String,

		personal: {
			firstName: String,
			lastName: String,
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
	 * @param    username  The username to create with
	 * @param    password  The password to assign to the user.
	 * @param    callback  The callback function to call once done.
	 */
	create: function(username, password, callback) {
		/* If there is no user with that email, create the user */
		var newUser = new this.model();

		/* set the user's local credentials */
		newUser.username = username;
		newUser.email = username;
		newUser.password = createHash(password);

		/* Give defaults to other parameters */
		newUser.isAdmin = false;
		newUser.language = 0;
		newUser.status = 1;

		/* Save and call the callback function */
		newUser.save(function(err) {
			callback(err, newUser);
		});
	}
}