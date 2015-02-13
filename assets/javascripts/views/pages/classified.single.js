module.exports = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

	render: function () {
		var slideshowTemplate = _.template($("#slideshow-template").html());
		var singleTemplate = _.template($("#single-template").html());


		/* Add the templates */
		$(".c-content").html(
			singleTemplate(window.data.classified)
		);
		$(".c-gallery").html(
			slideshowTemplate({ images: window.images })
		);

		/* Load FlexSlider (the slideshow), once the images in the slides have
		 *  been loaded by the browser */
		var that = this;
		var startFlexSlider = function() {
			$('.flexslider').flexslider({
				animation: "slide",
				controlNav: "thumbnails"
			});
		};
		imagesLoaded(this.$el, startFlexSlider);
	}
});