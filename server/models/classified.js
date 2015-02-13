var async = require('async'),
	mongoose =require('mongoose'),
	util = require('util');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;


module.exports = {
	model: mongoose.model('classified', {
		title: String,
		owner: ObjectId,
		description: String,

		category: Number,
		created: Date,
		guest: Boolean,
		images: [String],
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
	getTopClassifieds: function(db, callback) {
		var that = this;
		var results = [];
		var query = util.format(
			"SELECT * FROM %s \
				WHERE status = 2 \
				ORDER BY id DESC \
				LIMIT 10",
			this.table.main
		);


		/* The callback function once the SQL query gets executed */
		var querySolver = function (error, rows, fields) {
			if (error) throw error;
			results = rows;

			/*! Now we asynchronously make queries to get the images for each
			 *  of the classifieds */

			/* Perform the asynchronous tasks to get the locations and
			 * categories */
			async.each(results, asyncJob, asyncComplete);
		}

		/* Function to run on each task setup for the async */
		var asyncJob = function (result, callback) {
			/* Send the query to ther DB */
			that.getImages(db, result.id, function(images) {
				/* Save the result */
				if(images && images.length > 0) result.thumb = images[0].url;

				/* Async call is done, alert via callback */
				callback();
			});
		}

		/* Function to run once the async is done it's jobs. */
		var asyncComplete = function (error) { callback(results); }

		/* Execute the query */
		db.query(query, querySolver);
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