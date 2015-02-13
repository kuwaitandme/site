var mongoose = require('mongoose');


module.exports = {
	model: mongoose.model('locations', {
		name: String,
	}),

	/**
	 * Returns all the locations in the database.
	 *
	 * @param  callback       The callback function to call once done.
	 */
	getAll: function(callback) {
		this.model.find({}, function(err, result) {
			callback(result);
		});
	}
}