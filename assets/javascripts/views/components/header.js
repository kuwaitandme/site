module.exports = Backbone.View.extend({
	sliderAnimateWidth: 200,

	events: {
		"click #grabber-hide" : "hide",
		"click #grabber-display" : "show"
	},


	/**
	 * Hide the Slider
	 */
	hide: function() {
		this.shown = false;
		this.$sliderNav.stop().animate({ right: -1 * this.sliderAnimateWidth });

		this.expandMain();
	},


	/**
	 * Show the Slider
	 */
	show: function() {
		this.shown = true;
		this.$sliderNav.stop().animate({ right: 0 });

		this.shirnkMain();
	},


	/**
	 * Expands the main body
	 */
	expandMain: function() {
		var width = this.$window.width();
		var that = this;
		this.$main.stop().animate({marginLeft: 0}, function() {

			/* Remove the width style set by jQuery's animate. */
			that.$main.css("marginLeft", "");
		});
	},


	/**
	 * Shrinks the mainbody
	 */
	shirnkMain: function() {
		var width = this.$window.width();
		this.$main.stop().animate({ marginLeft: -1 * this.sliderAnimateWidth});
	},


	initialize: function() {
		this.shown = false;
		this.$main = $("main");
		this.$window = $(window);
		this.$sliderNav = $("#slider-nav");

		// this.$window.on("resize", this.hide);
	}
});