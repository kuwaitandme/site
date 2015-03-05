module.exports = Backbone.View.extend({
	messages: {
		reported: "Your report has been successfully submitted",
		notfound: "Classified was not found",
		needlogin: "You need to be logged in to make such requests",
		unpriv: "You are not allowed to make such bogus requests",
		rejected: "This classified has been rejected by a moderator",
		banned: "This classified has been banned by a moderator",
		archived: "This classified has been deleted",
	},

	initialize: function(obj) {
		var that = this;
		if(obj && obj.model) this.model = obj.model;
		else {
			var href = document.URL;
			var id = href.substr(href.lastIndexOf('/') + 1);
			this.model = new app.models.classified;
			this.model.fetch(id);
		}

		// this.displayMessage();

		/* Render the classified only if it's not banned or archived */
		// if(this.classified.status != 3 && this.classified.status != 4) {
		// 	this.render();

		// }

	},


	render: function () {
		var slideshowTemplate = _.template(this.$el.find("#slideshow-template").html());
		var singleTemplate = _.template(this.$el.find("#single-template").html());

		/* Add the main template */
		$(".c-content").html(singleTemplate(this.model.toJSON()));

		/* Add the image templates */
		var images = this.model.get("images");
		if(images.length > 0)
			this.$el.find(".c-gallery").html(slideshowTemplate({ images: images }));
		else
			this.$el.find(".c-gallery").hide();
		this.$el.find(".page").css("min-height", $(window).height());

		this.initMaps();
		// app.libs.smoothScroll.init();
		// this.renderAdminbar();
	},


	/**
	 * Get the classified from the page and return with some extra variables set.
	 */
	getClassified: function() {
		var classified = window.data.classified;
		classified.editable = window.data.editable;
		classified.superEditable = window.data.superEditable;
		return classified;
	},


	/**
	 * Display a message based on the classified's status.
	 */
	displayMessage: function() {
		/* Parse the URL and give out the appropriate message based on it. */
		var msg = app.messages;
		var getParam = app.helpers.url.getParam;
		if(getParam('error')) msg.error(this.messages[getParam('error')]);
		if(getParam('success')) msg.success(this.messages[getParam('success')]);
		if(getParam('warn')) msg.warn(this.messages[getParam('warn')]);

		if(this.classified.guest && this.classified.status == 0) {
			app.messages.warn("This classified was posted anonymously and is yet to be reviewed");
		} else if(!this.classified.editable && this.classified.status == 0) {
			app.messages.warn("Your classified is yet to be reviewed");
		} else if(this.classified.status == 0) {
			app.messages.warn("This classified is yet to be reviewed");
		}

		switch(this.classified.status) {
			case 2:
				app.messages.error(this.messages.rejected, "");
				app.messages.error(this.classified.adminReason, "Reason:");
				break;
			case 3:
				app.messages.error(this.messages.archived, "Archived!");
				break;
			case 4:
				app.messages.error(this.messages.banned, "");
				app.messages.error(this.classified.adminReason, "Reason:");
				break;
			case 5:
				app.messages.error("This classified has been reported too many times and is under review", "");
				break;
		}
	},


	/**
	 * Initializes Google maps if required.
	 */
	initMaps: function() {
		var that = this;
		this.$gmap = this.$el.find("#map-canvas");

		/* Initializes the map with the latitude and longitude given */
		function init(lat, lng) {
			var myLatlng = new google.maps.LatLng(lat, lng);
			var mapOptions = {
				center: myLatlng,
				mapTypeControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scrollwheel: false,
				zoom: 13,
			};

			/* Add the map */
			that.gmap = new google.maps.Map(that.$gmap[0], mapOptions);

			/* Add the marker */
			that.gmarker = new google.maps.Marker({
				position: myLatlng,
				map: that.gmap,
			});
		}

		/* If there are google co-ordinates saved, load up google maps */
		var meta = this.model.get("meta");
		if(meta && meta.gmapX && meta.gmapY) {
			init(meta.gmapX, meta.gmapY);

			// google.maps.event.addDomListener(window, 'load', init);
		} else { this.$gmap.hide(); }
	},


	renderAdminbar: function () {
		var adminTemplate = _.template(this.$el.find("#admin-template").html());

		/* Add the admin template */
		this.$el.find("#admin-single").html(adminTemplate(this.classified));
	}
});