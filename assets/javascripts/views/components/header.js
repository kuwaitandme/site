module.exports = Backbone.View.extend({
	sliderAnimateWidth: 170,

	events: {
		"click #grabber-hide" : "hide",
		"click #grabber-display" : "show"
	},


	/**
	 * Hide the Slider
	 */
	hide: function() {
		this.$sliderNav.stop().animate({ right: -1 * this.sliderAnimateWidth });

		var width = this.$window.width();
		this.$main.stop().animate({ width: width});
	},


	/**
	 * Show the Slider
	 */
	show: function() {
		this.$sliderNav.stop().animate({ right: 0 });

		var width = this.$window.width();
		this.$main.stop().animate({ width: width - this.sliderAnimateWidth});
	},

	initialize: function() {
		this.$main = $("main");
		this.$window = $(window);
		this.$sliderNav = $("#slider-nav");
	}
});