module.exports = Backbone.View.extend({
	sliderAnimateWidth: 200,
	events: {
		"click #grabber-hide" : "hide",
		"click #grabber-display" : "show",
		"click ul a" : "hide"
	},

	initialize: function() {
		console.log("[view:header] initializing");

		this.$main = $("main");
		this.$sliderNav = this.$el.find("#slider-nav");
		this.$mainNav = this.$el.find("#main-nav");
		this.$navHome = this.$mainNav.find('#nav-logo');
		this.$navLinks = this.$mainNav.find('.nav');
		this.$nextLink = this.$mainNav.find('.next');
		this.$previousLink = this.$mainNav.find('.prev');
	},


	/**
	 * Hide the Slider. This function animates the mainbody back to it's
	 * original position while at the same hiding the header sidebar.
	 */
	hide: function() {
		console.log("[view:header] hiding sidebar if opened");

		/* Animate the header sidebar */
		this.$sliderNav.transition({ x: 1 * this.sliderAnimateWidth });

		/* Animate the main-body back to it's original position. */
		this.$main.transition({ x: 0 });
	},


	/**
	 * Show the Slider. This function animates the mainbody to the left, to make
	 * space for the header sidebar which animates from the right.
	 */
	show: function() {
		console.log("[view:header] displaying sidebar");

		/* Animate the header sidebar */
		this.$sliderNav.transition({ x: 0 });

		/* Animate the mainbody to move to the left. */
		this.$main.transition({ x: -1 * this.sliderAnimateWidth });
	},


	/**
	 * This function decides if the header should show the nav icons instead of
	 * the main site logo. If we are in the homepage, then the sitelogo is
	 * displayed, otherwise the nav-options are displayed.
	 */
	update: function() {
		var that = this;
		var router = app.controllers.router;

		var homepageCondition = document.URL.split("/").length <= 4;

		if(homepageCondition) {
			console.log("[view:header] showing site logo");
			this.$navLinks.fadeOut(function() { that.$navHome.fadeIn(); });
		} else {
			console.log("[view:header] showing navigation controls");
			this.$navHome.fadeOut(function() { that.$navLinks.fadeIn(); });

			this.$previousLink.addClass('active');
			this.$nextLink.addClass('active');

			if(router.startingIndex >= router.historyIndex) {
				this.$previousLink.removeClass('active');
			}
			if(history.length <= router.historyIndex) {
				this.$nextLink.removeClass('active');
			}
		}
	}
});