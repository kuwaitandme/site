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
		description: String,
		title: String,

		authHash: String,
		guest: Boolean,
		owner: ObjectId,

		adminReason: String,
		category: ObjectId,
		created: Date,
		flaggersIP: [String],
		images: [String],
		price: Number,
		saleby: Number, /* 1:Owner,2:Distributer */
		status: Number, /* 0:Inactive,1:Active,2:Archived,3:Banned,4:Expired */
		type: Number,   /* 0:Sale,1:Want */

		contact: {
			address1: String,
			address2: String,
			email: String,
			location: ObjectId,
			phone: String
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
		classified.created = Date.now();
		classified.description = data.description;
		classified.price = data.price;
		classified.saleby = data.saleby;
		classified.status = 0;
		classified.title = data.title;
		classified.type = data.type;

		classified.contact.address1 = data.address1;
		classified.contact.address2 = data.address2;
		classified.contact.email = data.email;
		classified.contact.location = data.location;
		classified.contact.phone = data.phone;

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



	/**
	 * Returns the top classifieds. Usually the ones that should be displayed on
	 * the homepage.
	 *
	 * @param  db        The database connection object.
	 * @param  callback  The callback function to call once the query is
	 *                   finished.
	 */
	getTopClassifieds: function(callback) {
		var query = this.model.find({}, {authHash: 0}).sort({created: -1}).limit(10);

		query.exec(function(err, result) {
			callback(result);
		});
	},


	/**
	 * Gets a single classified, given it's id.
	 *
	 * @param  id        The id of the classified to find.
	 * @param  callback  The callback function to call once the query is
	 *                   finished.
	 */
	get: function (id, callback) {
		this.model.findOne({_id: id}, {authHash: 0}, function(err, result) {
			callback(result);
		});
	},


	/**
	 * Finds out how many classifieds are there in each category.
	 *
	 * @param  callback  The callback function to call once the query is
	 *                   finished.
	 */
	classifiedsPerCategory: function(callback) {
		/* The Mongo way of grouping and counting! */
		var agg = [{
			$group: {
				_id: "$category",
				total: {$sum: 1}
			}
		}];

		this.model.aggregate(agg, function(err, result){
	    	if (err)  throw err;
			callback(result);
		});
	},


	/**
	 * Finds all the classifieds with the given parameters
	 *
	 * @param  parameters  The parameters to use in the query
	 * @param  callback    The callback function to call once the query is
	 *                     finished.
	 */
	search: function(parameters, callback) {
		this.model.find(parameters, {authHash: 0}, function(err, results) {
			if(err) throw err;
			callback(results);
		});
	}
}