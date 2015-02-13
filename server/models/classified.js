var async = require('async'),
	mongoose =require('mongoose'),
	util = require('util');

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
	model: mongoose.model('classified', {
		title: String,
		description: String,

		owner: ObjectId,
		authHash: String,
		guest: Boolean,

		category: Number,
		created: Date,
		flaggersIP: [String],
		images: [String],
		price: Number,
		saleby: Number, /* 1:Owner,2:Distributer */
		status: Number, /* 0:Inactive,1:Active,2:Archived,3:Banned,4:Expired */
		type: Number,   /* 0:Sale,1:Want */
		adminReason: String,

		contact: {
			email: String,
			phone: String,
			location: Number,
			address1: String,
			address2: String
		}
	}),


	/**
	 * Creates a classified from the POST parameters passed from the request.
	 *
	 * @param  request     The request object with the POST data
	 * @param  callback    The callback function to call with the new classified
	 */
	createFromPOST: function(request, isGuest, callback) {
		var classified = new this.model();
		var data = request.body;

		classified.category = data.category;
		classified.contact.address1 = data.address1;
		classified.contact.address2 = data.address2;
		classified.contact.email = data.email;
		classified.contact.location = data.location;
		classified.contact.phone = data.phone;
		classified.created = Date.now();
		classified.description = data.description;
		classified.price = data.price;
		classified.saleby = data.saleby;
		classified.status = 0;
		classified.title = data.title;
		classified.type = data.type;

		/* If you are logged in, then we will make you the owner of this
		 * classified; Otherwise we will label this classified as a guest
		 * classified. */
		if(request.user && !isGuest) {
			classified.owner = request.user._id;
			classified.guest = false;
		} else {
			classified.guest = true;
			classified.authHash = randomHash();
		}

		classified.save();
		callback(classified);
	},


	/* Table names */
	table: {
		main: "classified",
		images: "classified_image"
	},

	/**
	 * Returns the top classifieds. Usually the ones that should be displayed on
	 * the homepage.
	 *
	 * @param  db        The database connection object.
	 * @param  callback  The callback function to call once the query is
	 *                   finished.
	 */
	getTopClassifieds: function(callback) {
		var query = this.model.find({}).sort({created: -1}).limit(10);

		query.exec(function(err, result) {
			callback(result);
		});
	},


	/**
	 * Gets a single classified, given it's id.
	 *
	 * @param  db        The database connection object.
	 * @param  id        The id of the classified to find.
	 * @param  callback  The callback function to call once the query is
	 *                   finished.
	 */
	get: function (db, id, callback) {
		var query = util.format(
			"SELECT * FROM %s \
				WHERE id='%s'",
			this.table.main, id
		);

		/* The callback function once the SQL query gets executed */
		var querySolver = function (error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);
		}

		/* Execute the query */
		db.query(query, querySolver);
	},


	/**
	 * Finds out how many classifieds are there in each category.
	 *
	 * @param  db        The database connection object.
	 * @param  callback  The callback function to call once the query is
	 *                   finished.
	 */
	classifiedsPerCategory: function(db, callback) {
		var query = util.format(
			"SELECT count(*) as count, category \
				FROM %s \
				GROUP BY category",
			this.table.main);

		/* The callback function once the SQL query gets executed */
		var querySolver = function (error, rows, fields) {
			if (error) throw error;
			callback(rows);
		}

		/* Execute the query */
		db.query(query, querySolver);
	},


	/**
	 * Returns an array of image ids for the given classified.
	 *
	 * @param  db        The database connection object.
	 * @param  id        The id of the classified to find.
	 * @param  callback  The callback function to call once the query is
	 *                   finished.
	 */
	getImages: function(db, id, callback) {
		var query = util.format(
			"SELECT url \
				FROM %s \
				WHERE cid = '%s';",
			this.table.images, id);

		/* The callback function once the SQL query gets executed */
		var querySolver = function (error, rows, fields) {
			if (error) throw error;
			callback(rows);
		}

		/* Execute the query */
		db.query(query, querySolver);
	}

}