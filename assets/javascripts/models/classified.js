var ajax = app.helpers.ajax;
var async = require('async');


/**
 * A Backbone model representing a single classified. This model contains
 * methods to manipulate and sync with the server.
 */
module.exports = Backbone.Model.extend({
	defaults: {
		/* Basic properties */
		_id: null,
		category: null,
		created: null,
		description: "",
		images: [],
		price: 0,
		status: 0,    /* 0:Inactive,1:Active,2:Rejected,3:Archived,4:Banned */
		title: "",
		type: 0,      /* 0:Sale,1:Want */
		views: 0,

		/* Admin related properties */
		adminReason: null,
		authHash: null,
		guest: true,
		owner: null,
		reports: [],
		perks: { urgent: false, promote: false },

		/* Contact information */
		contact: {
			address1: null,
			address2: null,
			email: null,
			location: null,
			phone: null
		},

		/* Extra meta properties */
		meta: {
			gmapX: null,
			gmapY: null
		}
	},


	/**
	 * Initializes the classified model object. The only here to do is attach
	 * the custom listeners.
	 */
	initialize: function() {
		// set this.id
		this.bind('parse', this.parseVariables, this);
	},


	/**
	 * Fetches the classified with the given id from the back-end.
	 *
	 * After setting the values in the database, we emit a 'ajax:done'
	 * event to any listeners waiting for the AJAX call to finish. The listeners
	 * will get an object referencing back to this model.
	 *
	 * @param  Number   id       The id of classified.
	 */
	fetch: function(id){
		var that = this;
		var url = app.config.host + "/classified/single/" + id;

		$.ajax({
			type: "GET",
			url: url,
			dataType: "json",
			crossDomain: true,
			async: false,
			beforeSend: ajax.setHeaders,

			/**
			 * On success we should get three fields. The main classified itself
			 * along with variables to indicate if the user is able to edit or
			 * not.
			 */
			success: function(response) {
				console.debug("[model:classified] fetching classified details", response);

				response.classified.editable = response.editable;
				response.classified.superEditable = response.superEditable;

				that.set(response.classified);

				/* Signal any listeners that we are done loading this
				 * classified */
				that.trigger("ajax:done", that);
			},
			error: function(e) {
				console.error("[model:classified] error fetching classified details", e);
			},
		});
	},


	/**
	 * Parses the variables in the model to user-friendly values. In this case
	 * the date and price are only formatted. This function is attached to the
	 * 'parse' event and get called when it is triggered.
	 */
	parseVariables: function() {
		/* Set a condition to avoid arguments from being parsed again */
		if(this.attributes.parsed) return;
		this.attributes.parsed = true;

		/* Convert the price into 'Free', '## KD' or 'Contact Owner' */
		var price = this.get("price");
		this.attributes.price = app.helpers.price.format(price);

		/* Convert Date to human readable format */
		var date = this.get("created");
		this.attributes.created = app.helpers.date.prettify(date);

	},


	/**
	 * Uploads the current classified object into the server. This function
	 * handles all the necessary file uploads and different AJAX calls. It also
	 * takes care of performing the necessary XSS cleaning and performing proper
	 * error handling.
	 *
	 * Once this function is done, it emits the 'ajax:done' event for any
	 * listener that is listening for the upload process to be completed.
	 *
	 * On every progressive successful AJAX call, the function emits a
	 * 'ajax:done:partial' event for any listener that is trying to track
	 * the progress of the upload.
	 *
	 * On error the function cleans up and emits the 'ajax:error' event with
	 * any error message to the any listener that is trying to trace any errors
	 * during upload.
	 *
	 * @param   String   captcha     A variable containing the capthca, if any
	 *                               that is to be sent with the request.
	 */
	uploadServer: function(captcha, files) {
		console.debug("[model:classified] uploading classified details to server", this);

		var that = this;
		var url = app.config.host + "/classified/post/";

		/* Get the JSON to send in the first request. The first request should
		 * not contain the files. The files will be uploaded asynchronously in
		 * the next request */
		var json = this.toJSON();
		json.files = null;

		/* A progress handler function to show how much of the file
		 * upload is done. */
		progressHandler = function(event) {
			if(event.lengthComputable)
				that.trigger("ajax:done:partial", event);
				// $('progress').attr({value:e.loaded,max:e.total});
		}

		$.ajax({
			beforeSend: ajax.setHeaders,
			data: this.getFormData(files),
			processData: false,
			contentType: false,
			type: "POST",
			url: url,
			/* Create a custom XMLHttp request that has a progress
			 * handler linked to it.
			 */
			xhr: function() {
				var Xhr = $.ajaxSettings.xhr();
				/* Attach the progress handler, if supported */
				if(Xhr.upload) Xhr.upload.addEventListener('progress',
					progressHandler, false);
				return Xhr;
			},

			/**
			 * On success, we should get the details of the new classified
			 * returned to us an object. The only thing that is different from
			 * what we have here is a new '_id' which is what got set in the
			 * DB. We will use this to perform the filupload further.
			 */
			success: function(response) {
				if(!response._id) {
					console.error("[model:classified] error uploading classified", response);
					return that.trigger("ajax:error", response);
				}

				/* Get the id from the response */
				that.set("_id", response._id);

				/* Let listeners know that we have successfully uploaded the
				 * classified */
				that.trigger("ajax:done");
			},
			error: function(e) {
				console.error("[model:classified] error uploading classified details", e);
				that.trigger('ajax:error', e);
			},
		});
	},



	getFormData: function() {
		var formdata = new FormData();
		var data = this.toJSON();
		var files = data.files;
		delete data.files;
		formdata.append('data', JSON.stringify(data));

		_.each(files, function(file) {
			formdata.append('files[]', file);
		});

		return formdata;
	},


	/**
	 * Function to update the classified in the server.
	 */
	updateServer: function() { },
});