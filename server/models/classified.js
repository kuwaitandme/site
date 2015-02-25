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


var classifieds = module.exports  = {
	model: mongoose.model('classified', {
		/* Basic properties */
		category: ObjectId,
		created: Date,
		description: String,
		images: [String],
		price: Number,
		saleby: Number, /* 1:Owner,2:Distributer */
		status: Number, /* 0:Inactive,1:Active,2:Rejected,3:Archived,4:Banned */
		title: String,
		type: Number,   /* 0:Sale,1:Want */
		views: Number,

		/* Admin related properties */
		adminReason: String,
		authHash: String,
		guest: Boolean,
		owner: ObjectId,
		reports: [{ reason: String, ip: String }],
		perks: { urgent: Boolean, promote: Boolean },

		/* Contact information */
		contact: {
			address1: String,
			address2: String,
			email: String,
			location: ObjectId,
			phone: String
		},

		/* Extra meta properties */
		meta: {
			gmapX: Number,
			gmapY: Number
		}
	}),

	/* The number of classifieds that get displayed per page */
	classifiedPerPage: 15,

	/* The number of reports for a classified before which it gets flagged */
	reportsPerPostBeforeFlag: 3,


	/**
	 * Creates a classified from the POST parameters passed from the request.
	 *
	 * @param  Object    request     The request object for the current session.
	 * @param  Object    user        The currently logged in user's object.
	 * @param  Function  callback    The callback function to call with the new
	 *                               POST data.
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
	 * @param  Object    request     The request object for the current session.
	 * @param  Function  callback    The callback function to call with the new
	 *                               POST data.
	 */
	_doFiles: function(request, callback) {
		file.upload(request, function(POSTdata) {
			callback(POSTdata);
		});
	},


	/**
	 * Helper function used to fill up the data of the classified object.
	 *
	 * @param  Object    POSTdata    The object with the POST data
	 * @param  Object    user        The currently logged in user's object.
	 * @param  Function  callback    The callback function to call with the new
	 *                               classified
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

		/* Start saving the fields one by one */
		classified.category = POSTdata.category;
		classified.contact.address1 = xss(POSTdata.address1);
		classified.contact.address2 = xss(POSTdata.address2);
		classified.contact.email = xss(POSTdata.email);
		classified.contact.location = xss(POSTdata.location);
		classified.contact.phone = POSTdata.phone;
		classified.description = xss(POSTdata.description);
		classified.images = POSTdata.images;
		classified.meta.gmapX = POSTdata.gmapX;
		classified.meta.gmapY = POSTdata.gmapY;
		classified.price = POSTdata.price;
		classified.saleby = POSTdata.saleby;
		classified.title = xss(POSTdata.title);
		classified.type = POSTdata.type;

		/* Set up some defaults */
		classified.created = Date.now();
		classified.perks.promote = false;
		classified.perks.urgent = false;
		classified.views = 0;

		/* Create a random hash for guest classifieds */
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

		/* Commit to the database and call the callback function */
		classified.save();
		callback(classified);
	},


	/**
	 * Gets a single classified, given it's id.
	 *
	 * @param  Number   id        The id of the classified to find.
	 * @param  Function callback  The callback function to call once the query
	 *                            is finished.
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
	 * @param  Function   callback  The callback function to call once the query
	 *                              is finished.
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
	 * @param  Object    parameters  The parameters to use in the query
	 * @param  Function  callback    The callback function to call once the
	 *                               query is finished.
	 * @param  Number    page        The current page number to fetch classifieds
	 *                               from.
	 * @param  Boolean   reverse     Sort the classifieds in descending order
	 *                               from date created iff this is set to true.
	 */
	search: function(parameters, callback, page, reverse) {
		var sort = -1;

		if(!page) page = 1;
		if(reverse) sort = 1;

		/* Prepare a query which searchs with the given parameter and offsets
		 * and limits with the 'classifieds per page' and 'page index' parameters
		 */
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
	 * Labels a classified as an urgent classified
	 *
	 * @param  Number   id        The id of the classified to make urgent.
	 */
	makeUrgent: function(id) {
		this.model.findOne({_id: id}, function(err, classified) {
			if(err) throw err;

			classified.perks.urgent = true;
			classified.save();
		});
	},


	/**
	 * Promotes a classified.
	 *
	 * @param  Number   id        The id of the classified to promote.
	 */
	promote: function(id) {
		this.model.findOne({_id: id}, function(err, classified) {
			if(err) throw err;

			classified.perks.promote = true;
			classified.save();
		});
	},


	/**
	 * Increments the view counter of the classified.
	 *
	 * @param  Number   id        The id of the classified.
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
	 * Add a report to the classified with the given reason. If the user is
	 * spamming this classified then the report gets rejected. If the classified
	 * has too many reports then it gets flagged for a moderator to be review.
	 *
	 * @param  Number id      id of the classified which is getting reported.
	 * @param  String reason  The reason for reporting the classified.
	 * @param  String ip      ip address of the person reporting the classified.
	 */
	report: function (id, reason, ip) {
		this.model.findOne({_id: id}, function(err, classified) {
			if(err) throw err;

			/* Check if the same ip is flagging the classified or not, to avoid
			 * spam */
			var spam = false;
			for(var i=0; i<classified.reports.length; i++)
				if(classified.reports[i].ip == ip) spam = true;
			if(spam) return;

			/* If it was a valid report, add it to the list of reports */
			classified.reports.push({
				ip: ip,
				reason: reason
			});

			/* Check if this classified has reached it's limit for it to be
			 * reviewed by an admin */
			if(classified.reports.length > this.reportsPerPostBeforeFlag)
				classified.status = this.status.FLAGGED;

			/* Commit to the database */
			classified.save();
		});
	},

	/* The functions below perform actions on only the status of the
	 * classified */
	status: {
		INACTIVE: 0,
		ACTIVE: 1,
		REJECTED: 2,
		ARCHIVED: 3,
		BANNED: 4,
		FLAGGED: 5,
		VERIFIED: 6,


		/**
		 * Archives the given classified
		 *
	     * @param  Number   id        The id of the classified to archive.
		 */
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

		/**
		 * Bans the given classified with the given reason.
		 *
	     * @param  Number   id        The id of the classified to archive.
	     * @param  String   reason    The reason for the ban
		 */
		ban: function (id, reason) {
			var that = this;
			classifieds.model.findOne({_id: id}, function(err, classified) {
				if(err) throw err;

				classified.status = that.BANNED;
				classified.adminReason = reason;
				classified.save();
			});
		},


		/**
		 * Reposts the given classified. Avoids reposting classified that are
		 * either banned, rejected or flagged. Reposting a guest classified
		 * makes it an inactive classified awaiting for moderations. Normal
		 * classifieds get published automatically.
		 *
	     * @param  Number   id        The id of the classified to repost.
		 */
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


		/**
		 * Publishes the given classified with the given reason.
		 *
	     * @param  Number   id        The id of the classified to publish.
		 */
		publish: function (id) {
			var that = this;
			classifieds.model.findOne({_id: id}, function(err, classified) {
				if(err) throw err;

				classified.status = that.ACTIVE;
				classified.save();
			});
		},


		/**
		 * Rejects the given classified with the given reason.
		 *
	     * @param  Number   id        The id of the classified to reject.
	     * @param  String   reason    The reason for the reject
		 */
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