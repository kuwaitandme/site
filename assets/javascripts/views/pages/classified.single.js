module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

	initMaps: function(lat, lng) {
		var that = this;

		function init() {
			var myLatlng = new google.maps.LatLng(lat, lng)
			var mapOptions = {
				zoom: 13,
				center: myLatlng
			}

			/* Add the map */
			that.gmap = new google.maps.Map(that.$gmap[0], mapOptions);

			/* Add the marker */
			that.gmarker = new google.maps.Marker({
				position: myLatlng,
				map: that.gmap,
			});
		}

		google.maps.event.addDomListener(window, 'load', init);
	},

	render: function () {
		var slideshowTemplate = _.template($("#slideshow-template").html());
		var singleTemplate = _.template($("#single-template").html());

		var classified = window.data.classified;
		classified.editable = window.data.editable;
		classified.superEditable = window.data.superEditable;

		/* Add the templates */
		$(".c-content").html(
			singleTemplate(classified)
		);
		if(classified.images && classified.images.length > 0) {
			$(".c-gallery").html(
				slideshowTemplate({ images: classified.images })
			);
		} else {
			$(".c-gallery").hide();
		}

		this.$gmap = this.$el.find("#map-canvas");

		/* If there are google co-ordinates saved, load up google maps */
		if(classified.meta && classified.meta.gmapX && classified.meta.gmapY) {
			this.initMaps(classified.meta.gmapX, classified.meta.gmapY);
		} else {
			this.$gmap.hide();
		}

		/* Load FlexSlider (the slideshow), once the images in the slides have
		 *  been loaded by the browser */
		var that = this;
		// var startFlexSlider = function() {
		// 	$('.flexslider').flexslider({
		// 		animation: "slide",
		// 		controlNav: "thumbnails"
		// 	});
		// };
		// imagesLoaded(this.$el, startFlexSlider);
	}
});