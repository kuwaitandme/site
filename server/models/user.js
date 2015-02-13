var mongoose = require('mongoose');

module.exports = {
	model: mongoose.model('user', {
		username: String,
		password: String,
		email: String,

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
		}
	})
}