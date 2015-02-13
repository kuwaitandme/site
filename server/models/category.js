var mongoose = require('mongoose');

module.exports = {
	model: mongoose.model('categories', {
		name: String,
		children: {
			name: String
		}
	}),

	/**
	 * Returns all the classifieds in the database.
	 *
	 * @param  callback       The callback function to call once done.
	 */
	getAll: function(callback) {
		this.model.find({}, function(err, result) {
			callback(result);
		});
	}
}