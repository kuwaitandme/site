module.exports = Backbone.View.extend({
	initialize: function(obj) {
		this.model = options.model;
		this.$gmap = this.$el.find("#map-canvas");
		this.$gmapX = this.$el.find("#gmapX");
		this.$gmapY = this.$el.find("#gmapY");
	},


	/**
	 * [render description]
	 */
	render: function() {
		/* Resize the pages whenever the window resizes */
		$(window).resize(function() {
			$(".page").css("min-height", $(window).height());
		}).resize();

		this.$currentPage = $("#page-0");
		this.$currentPage.show();
		this.$currentPage.transition({ opacity: 1 });

		this.$gmap.css('min-height', $(window).height()/3);

		/* Initialize parts of the form */
		this.initCategories();
		this.initDropzone();
		this.initLocations();
		this.$description.redactor();
		this.spinner = new app.views.components.spinner();
	},


	validate: function() { return true; },

	/**
	 * Unlocks the map and address fields.
	 */
	unlockMapAndAddress: function(e) {
		var lastVal = this.$locations.find('option:last-child').val();

		/* Check if we selected the last option or not. If we have, then disable
		 * the map and the address fields */
		if(this.$locations.val() != lastVal) {
			$("[name='address1']").removeClass("hide");
			$("[name='address2']").removeClass("hide");
			$("#page-4").removeClass("hide");
			$("#page-4-prev, #page-4-next").attr('href', '#page-4');
		} else {
			$("[name='address1']").addClass('hide');
			$("[name='address2']").addClass('hide');
			$("#page-4").addClass("hide");
			$("#page-4-prev").attr('href', '#page-3');
			$("#page-4-next").attr('href', '#page-5');
		}
	},


	/**
	 * Gets all the form data from the page, into a local variable and returns
	 * it.
	 */
	getFormData: function() {
		this.model.set({
			meta: {
				gmapX: this.$gmapX.val(),
				gmapY: this.$gmapY.val()
			}
		});
	},


	/**
	 * Initializes Google maps
	 */
	initMaps: function() {
		/* The default co-ordinates to which we will center the map */
		var myLatlng = new google.maps.LatLng(29.27985, 47.98448)

		/* Initialize the map */
		this.gmap = new google.maps.Map(this.$gmap[0], {
			center: myLatlng,
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false,
			// draggable: false,
			zoom: 13,
		});

		/* Initialize the marker */
		this.gmarker = new google.maps.Marker({
			draggable: true,
			map: this.gmap,
			position: myLatlng
		});

		/* Add a listener to center the map on the marker whenever the
		 * marker has been dragged */
		google.maps.event.addListener(this.gmarker, 'dragend',
			function (event) {
				/* Center the map on the position of the marker */
				var latLng = this.gmarker.getPosition();
				this.gmap.setCenter(latLng);

				/* Set our hidden input fields so that thethis. backend can catch
				 * it */
				this.$gmapX.val(latLng.lat());
				this.$gmapY.val(latLng.lng());
		});
	},
});