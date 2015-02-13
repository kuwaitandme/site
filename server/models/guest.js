var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;


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
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	s4() + '-' + s4() + s4() + s4();
}

module.exports = {
	model: mongoose.model('Guest', {
		classified: ObjectId,
		hash: String
	}),

	/**
	 * Finds a guest user given his/her authentication hash.
	 *
	 * @param  hash       The authentication hash to query against.
	 * @param  callback   The callback function to call once done.
	 */
	findbyHash: function(hash, callback) {
		this.model.findOne({ hash: hash }, function(err, guest) {
			if(err) throw err;

			callback(guest);
		});
	},


	/**
	 * Creates a new guest account with the given classified ID. Calls the
	 * callback function with a unique authentication hash for the guest.
	 *
	 * @param  classifiedId   The ObjectId of the classified to be attached with
	 * @param  callback       The callback function to call once done.
	 */
	createWithClassified: function(classifiedId, callback) {
		var guest = new this.model();

		/* set the user's local credentials */
		guset.classified = classifiedId;
		guest.hash = randomHash();

		/* save the guest */
		guest.save(function(err) { if (err) throw err; });

		/* Return with the guest hash */
		callback(guest.hash);
	}
}