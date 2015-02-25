var async = require('async'),
	mongoose =require('mongoose'),
	util = require('util'),
	xss = require('xss');

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


module.exports = classifieds = {
	model: mongoose.model('classified', {
		description: String,
		title: String,

		authHash: String,
		guest: Boolean,
		owner: ObjectId,

		adminReason: String,
		category: ObjectId,
		created: Date,
		flags: [{
			reason: String,
			ip: String
		}],
		images: [String],
		price: Number,
		saleby: Number, /* 1:Owner,2:Distributer */
		status: Number, /* 0:Inactive,1:Active,2:Rejected,3:Archived,4:Banned */
		type: Number,   /* 0:Sale,1:Want */
		views: Number,

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

	classifiedPerPage: 3,


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

		var hexRegex = /^[0-9A-F]*$/i;
		var numberRegex = /^[0-9.]*$/i;

		/* Check for any empty fields */
		if(!POSTdata || !POSTdata.category || !POSTdata.description ||
			!POSTdata.price || !POSTdata.saleby || !POSTdata.title ||
			!POSTdata.type || !POSTdata.email || !POSTdata.location)
			return callback(null);

		/* Check for any invalid fields */
		if (!hexRegex.test(POSTdata.category) ||
			!hexRegex.test(POSTdata.location) ||
			!numberRegex.test(POSTdata.price) ||
			!numberRegex.test(POSTdata.saleby) ||
			!numberRegex.test(POSTdata.type) ||
			!numberRegex.test(POSTdata.gmapX) ||
			!numberRegex.test(POSTdata.gmapY) ||
			!numberRegex.test(POSTdata.phone))
			return callback(null);

		classified.category = POSTdata.category;
		classified.created = Date.now();
		classified.description = xss(POSTdata.description);
		classified.images = POSTdata.images;
		classified.price = POSTdata.price;
		classified.saleby = POSTdata.saleby;
		classified.title = xss(POSTdata.title);
		classified.type = POSTdata.type;
		classified.views = 0;

		classified.perks.urgent = false;
		classified.perks.promote = false;

		classified.meta.gmapX = POSTdata.gmapX;
		classified.meta.gmapY = POSTdata.gmapY;

		classified.contact.address1 = xss(POSTdata.address1);
		classified.contact.address2 = xss(POSTdata.address2);
		classified.contact.email = xss(POSTdata.email);
		classified.contact.location = xss(POSTdata.location);
		classified.contact.phone = POSTdata.phone;

		classified.authHash = randomHash();

		/* If you are logged in, then we will make you the owner of this
		 * classified; Otherwise we will label this classified as a guest
		 * classified. */
		if(user && user._id) {
			classified.owner = user._id;
			classified.guest = false;
			classified.status = this.status.ACTIVE;
		} else {
			classified.status = this.status.INACTIVE;
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
			if (err)  throw err;
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
		this.model.findOne({_id: id}, function(err, result) {
			if (err)  throw err;
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
	search: function(parameters, callback, page, reverse) {
		var sort = -1;

		if(!page) page = 1;
		if(reverse) sort = 1;

		var query = this.model.find(parameters, {authHash: 0})
			.sort( { created: sort } )
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
	},


	/**
	 * [incrementViewCounter description]
	 *
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	incrementViewCounter: function (id) {
		this.model.findOne({_id: id}, function(err, classified) {
			if(err) throw err;

			if(!classified.views) classified.views = 1;
			else classified.views += 1;

			classified.save();
		});
	},


	/**
	 * [report description]
	 *
	 * @param  {[type]} id     [description]
	 * @param  {[type]} reason [description]
	 * @param  {[type]} ip     [description]
	 */
	report: function (id, reason, ip) {
		this.model.findOne({_id: id}, function(err, classified) {
			if(err) throw err;

			var spam = false;
			for(var i=0; i<classified.flags.length; i++)
				if(classified.flags[i].ip == ip) spam = true;

			if(spam) return;

			classified.flags.push({
				ip: ip,
				reason: reason
			});

			if(classified.flags.length > 3) classified.status = this.status.FLAGGED;

			classified.save();
		});
	},

	status: {
		INACTIVE: 0,
		ACTIVE: 1,
		REJECTED: 2,
		ARCHIVED: 3,
		BANNED: 4,
		FLAGGED: 5,
		VERIFIED: 6,

		archive: function (id) {
			var that = this;
			classifieds.model.findOne({_id: id}, function(err, classified) {
				if(err) throw err;

				if(classified.status == that.BANNED ||
					classified.status == that.FLAGGED) return;

				classified.status = that.ARCHIVED;
				classified.save();
			});
		},
		ban: function (id, reason) {
			var that = this;
			classifieds.model.findOne({_id: id}, function(err, classified) {
				if(err) throw err;

				classified.status = that.BANNED;
				classified.adminReason = reason;
				classified.save();
			});
		},
		repost: function (id) {
			var that = this;
			classifieds.model.findOne({_id: id}, function(err, classified) {
				if(err) throw err;

				if(classified.status == that.BANNED ||
					classified.status == that.FLAGGED ||
					classified.status == that.REJECTED) return;

				if(classified.guest) classified.status = that.INACTIVE;
				else classified.status = that.ACTIVE;

				classified.save();
			});
		},
		publish: function (id) {
			var that = this;
			classifieds.model.findOne({_id: id}, function(err, classified) {
				if(err) throw err;

				classified.status = that.ACTIVE;
				classified.save();
			});
		},
		reject: function (id, reason) {
			var that = this;
			classifieds.model.findOne({_id: id}, function(err, classified) {
				if(err) throw err;

				classified.status = that.REJECTED;
				classified.adminReason = reason;
				classified.save();
			});
		}
	}
}