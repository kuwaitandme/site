var async = require('async'),
	mongoose =require('mongoose'),
	util = require('util');

var file = require('../controllers/helpers/file');

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
		status: Number, /* 0:Inactive,1:Active,2:Rejected,3:Archived,4:Banned */
		type: Number,   /* 0:Sale,1:Want */

		perks: {
			urgent: Boolean,
			promote: Boolean
		},

		contact: {
			address1: String,
			address2: String,
			email: String,
			location: ObjectId,
			phone: String
		},

		meta: {
			gmapX: Number,
			gmapY: Number
		}
	}),

	classifiedPerPage: 30,

	/**
	 * Creates a classified from the POST parameters passed from the request.
	 *
	 * @param  data        The object with the POST data
	 * @param  user        The currently logged in user's object.
	 * @param  callback    The callback function to call with the new classified
	 */
	createFromPOST: function(request, user, callback) {
		var that = this;

		that._doFiles(request, function(POSTdata) {
			that._doData(POSTdata, user, callback);
		});
	},


	/**
	 * Helper function used to upload the files
	 *
	 * @param  request
	 * @param  callback    The callback function to call with the new POST data.
	 */
	_doFiles: function(request, callback) {
		file.upload(request, function(POSTdata) {
			callback(POSTdata);
		});
	},


	/**
	 * Helper function used to fill up the data of the classified object.
	 *
	 * @param  POSTdata    The object with the POST data
	 * @param  user        The currently logged in user's object.
	 * @param  callback    The callback function to call with the new classified
	 */
	_doData: function(POSTdata, user, callback) {
		var classified = new this.model();

		classified.category = POSTdata.category;
		classified.created = Date.now();
		classified.description = POSTdata.description;
		classified.images = POSTdata.images;
		classified.price = POSTdata.price;
		classified.saleby = POSTdata.saleby;
		classified.status = 0;
		classified.title = POSTdata.title;
		classified.type = POSTdata.type;

		classified.perks.urgent = false;
		classified.perks.promote = false;

		classified.meta.gmapX = POSTdata.gmapX;
		classified.meta.gmapY = POSTdata.gmapY;

		classified.contact.address1 = POSTdata.address1;
		classified.contact.address2 = POSTdata.address2;
		classified.contact.email = POSTdata.email;
		classified.contact.location = POSTdata.location;
		classified.contact.phone = POSTdata.phone;

		classified.authHash = randomHash();

		/* If you are logged in, then we will make you the owner of this
		 * classified; Otherwise we will label this classified as a guest
		 * classified. */
		if(user && user._id) {
			classified.owner = user._id;
			classified.guest = false;
		} else {
			classified.guest = true;
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
	search: function(parameters, callback, page) {
		if(!page) page = 1;

		var query = this.model.find(parameters, {authHash: 0})
			.sort( { created: -1 } )
			.skip(page > 0 ? ((page - 1) * this.classifiedPerPage) : 0)
			.limit(this.classifiedPerPage);

		query.exec(function(err, result) {
			if(err) throw err;
			callback(result);
		});
	},


	/**
	 * [makeUrgent description]
	 *
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	makeUrgent: function(id) {
		this.model.findOne({_id: id}, function(err, classified) {
			if(err) throw err;

			classified.perks.urgent = true;
			classified.save();
		});
	},


	/**
	 * [promote description]
	 *
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	promote: function(id) {
		this.model.findOne({_id: id}, function(err, classified) {
			if(err) throw err;

			classified.perks.promote = true;
			classified.save();
		});
	}
}