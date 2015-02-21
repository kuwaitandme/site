module.exports = Backbone.View.extend({
	sliderAnimateWidth: 200,

	initialize: function() {
		this.shown = false;
		this.$main = $("main");
		this.$window = $(window);
		this.$sliderNav = $("#slider-nav");
	},


	events: {
		"click #grabber-hide" : "hide",
		"click #grabber-display" : "show"
	},


	/**
	 * Hide the Slider
	 */
	hide: function() {
		this.shown = false;
		this.$sliderNav.transition({ x: 1 * this.sliderAnimateWidth });

		this.expandMain();
	},


	/**
	 * Show the Slider
	 */
	show: function() {
		this.shown = true;
		this.$sliderNav.transition({ x: 0 });

		this.shirnkMain();
	},


	/**
	 * Expands the main body
	 */
	expandMain: function() {
		var width = this.$window.width();
		var that = this;
		this.$main.transition({ x: 0 });
	},


	/**
	 * Shrinks the mainbody
	 */
	shirnkMain: function() {
		var width = this.$window.width();
		this.$main.transition({ x: -1 * this.sliderAnimateWidth });
		// this.$main.stop().animate({ marginLeft: });
	}
});