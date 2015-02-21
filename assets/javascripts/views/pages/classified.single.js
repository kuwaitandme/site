module.exports = Backbone.View.extend({
	initialize: function() {
		this.classified = this.getClassified();
		this.displayMessage();

		/* Render the classified only if it's not banned or archived */
		if(this.classified.status != 3 && this.classified.status != 4) {
			this.render();
			this.initMaps();
		}
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
		if(this.classified.guest && this.classified.status == 0) {
			app.messages.warn("This classified was posted anonymously and is yet to be reviewed");
		} else if(!this.classified.editable && this.classified.status == 0) {
			app.messages.warn("Your classified is yet to be reviewed");
		} else if(this.classified.status == 0) {
			app.messages.warn("This classified is yet to be reviewed");
		}

		switch(this.classified.status) {
			case 2:
				app.messages.error("This classified has been rejected by a moderator", "");
				app.messages.error(this.classified.adminReason, "Reason:");
			case 3:
				app.messages.error("This classified has been deleted by it's owner", "Archived!");
				break;
			case 4:
				app.messages.error("This classified has been banned by an admin", "");
				app.messages.error(this.classified.adminReason, "Reason:");
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
		if(this.classified.meta && this.classified.meta.gmapX && this.classified.meta.gmapY) {
			init(this.classified.meta.gmapX, this.classified.meta.gmapY);

			// google.maps.event.addDomListener(window, 'load', init);
		} else { this.$gmap.hide(); }
	},

	render: function () {
		var slideshowTemplate = _.template($("#slideshow-template").html());
		var singleTemplate = _.template($("#single-template").html());

		/* Add the main template */
		$(".c-content").html(singleTemplate(this.classified));

		/* Add the image templates */
		if(this.classified.images && this.classified.images.length > 0) $(".c-gallery").html(
			slideshowTemplate({ images: this.classified.images }));
		else $(".c-gallery").hide();
		$(".page").css("min-height", $(window).height() - 100);
	}
});