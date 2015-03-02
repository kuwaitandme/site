var mongoose = require('mongoose'),
	bCrypt = require('bcrypt-nodejs');

/**
 * Creates a salted hash from the given password.
 */
function createHash(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


/**
 * Helper function to create a random hash
 *
 * @return    Returns a random hash with a GUID type format.
 */
function randomHash() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + s4() + s4() + s4() + s4();
}


var users = module.exports = {
	model: mongoose.model('user', {
		/* Main info */
		username: String,
		password: String,
		email: String,

		/* Admin related settings */
		activationToken: String,
		adminReason: String,
		isAdmin: Boolean,
		language: Number,
		lastLogin: [String],
		resetToken: String,
		status: Number, /* 0:Inactive,1:Active,2:Banned */

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

	status: {
		INACTIVE: 0,
		ACTIVE: 1,
		BANNED: 2
	},


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
		newUser.status = this.status.INACTIVE;
		newUser.activationToken = randomHash();

		/* Save and call the callback function */
		newUser.save(function(err) { callback(err, newUser); });
	},


	/**
	 * [activate description]
	 *
	 * @param  {[type]}   id       [description]
	 * @param  {[type]}   token    [description]
	 * @param    Function  callback  The callback function to call once done.
	 */
	activate: function(id, token, callback) {
		this.model.findOne({ _id: id}, function(err, user) {
			if(err) throw err;

			/* Check if user exists */
			if(!user) return callback(null, false);

			/* Check the activation token */
			if(user.activationToken != token) return callback(null, false);

			/* Activate the user */
			user.activationToken = "";
			user.status = users.status.ACTIVE;
			user.save(function(err) { callback(err, true); });
		});
	},

	createResetToken: function(email, callback) {
		this.model.findOne({ email: email }, function(err, user) {
			if(err) throw err;

			/* Check if the user exists */
			if(!user) return callback(null, null);

			/* Check if the user is activated */
			if(user.status != users.status.ACTIVE) callback(null, null);

			/* Generate a reset token */
			user.resetToken = randomHash();
			user.save(function(err) { callback(err, user); });
		});
	},

	resetPassword: function(id, token, password, callback) {
		this.model.findOne({ _id: id}, function(err, user) {
			if(err) throw err; /* Check cast error */

			/* Check if user exists */
			if(!user) return callback(null, false);

			/* Check if a password request was set or not */
			if(!user.resetToken) return callback(null, false);


			/* Check the reset token */
			if(user.resetToken != token) return callback(null, false);

			/* Reset the user password and get rid of reset token */
			user.password = createHash(password);
			user.resetToken = null;
			user.save(function(err) { callback(err, true); });
		});
	}
}