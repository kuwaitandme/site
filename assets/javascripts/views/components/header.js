module.exports = Backbone.View.extend({
	// template: Templates["header"],
	state: false,

	height: {
		hidden: 0,
		shown: 159,
	},

	events: {
		"click #mobile-nav-grabber" : "toggleMobile"
	},


	/**
	 * Toggles the mobile nav.
	 */
	toggleMobile: function() {
		if((this.state = !this.state)) this.show();
		else this.hide();
	},


	/**
	 * Hide the header for mobile
	 */
	hide: function() {
		this.state = false;
		this.$mobileNav.removeClass("reveal");
	},


	/**
	 * Show the header
	 */
	show: function() {
		this.state = true;
		this.$mobileNav.addClass("reveal");
	},


	/**
	 * Generates an array of links to be used by the header
	 */
	generateLinks: function() {
		var loggedin = (window.app.data.user != "anonymous");

		var ret = [{
				url: app.language.current.url + "/",
				name: window.lang.header.home,
				view: "landing"
			}, {
				url: app.language.current.url + "/classified/post",
				name: window.lang.header.postad,
				view: "classified/post"
			}
		];

		if(loggedin) ret.push({
				name: window.lang.header.manage,
				url: app.language.current.url + "/classified/manage",
				view: "classified/manage"
			}, {
				name: window.lang.header.logout,
				url: app.language.current.url + "/auth/logout",
			}
		);
		else ret.push({
				name: window.lang.header.login,
				url: app.language.current.url + "/auth/",
				view: "auth/login"
			}, {
				name: window.lang.header.signup,
				url: app.language.current.url + "/auth/signup",
				view: "auth/signup"
			}
		);
		return ret;
	},

	render: function() {
		this.$el.html(this.template({
			language: window.app.language,
			links: this.generateLinks()
		}));

		this.$mobileNav = $("#mobile-sub-nav");
	}
});