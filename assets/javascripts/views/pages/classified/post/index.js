var views = {
	begin: require('./part.begin'),
	details: require('./part.details'),
	finish: require('./part.finish'),
	images: require('./part.images'),
	info: require('./part.info'),
	maps: require('./part.maps'),
	submit: require('./part.submit')
};

var router = Backbone.Router.extend({
	views: {},
	routes: {
		"page-begin": "showPageBegin",
		"page-details": "showPageDetails",
		"page-finish": "showPageFinish",
		"page-images": "showPageImages",
		"page-info": "showPageInfo",
		"page-maps": "showPageMaps",
		"page-submit": "showPageSubmit",
		"*path": "startup"
	},


	initialize: function(options) {
		console.log("[view:classified-post] initializing router")
		var that = this;
		this.model = options.model;
		this.$el = options.$el;

		this.listenTo(this.model, "ajax:done", function() {
			that.navigate("page-finish", {trigger: true});
		});

		this.listenTo(this.model, "post:error", function(message) {
			that.displayError(message)
		});
	},

	close: function() {
		this.$el.empty();
		this.$el.off();
		this.stopListening();
	},

	startup: function() {
		console.log("[view:classified-post] redirecting to starting route");
		this.showPageBegin();
	},

	displayError: function(message) {
		this.currentView.$el.find("ul.error-message")
			.hide()
			.append("<li>" + message + "</li>")
			.fadeIn();
	},


	switchPage: function(viewname, el) {
		var that = this;
		console.group("[view:classified-post] switching to page:", viewname);

		console.debug("[view:classified-post]", this.$el.find(el));
		/* If the view wasn't initialized already, initialize it */
		if(!this.views[viewname]) this.views[viewname] = new views[viewname]({
			el: el,
			model: this.model
		});
		var view = this.views[viewname];

		console.debug("[view:classified-post] using sub-view:", view);

		/* Remove all error messages */
		$("ul.error-message li").remove();

		/* Set the current view variable */
		if(this.currentView) {
			/* If the view's validation function failed, stay in the same view */
			if(this.currentView.validate && !this.currentView.validate())
				return this.navigate(this.currentFragment, {trigger: false});

			/* Animate and switch the DOM elements */
			var $el = this.currentView.$el;
			console.debug("[view:classified-post] animating previous view", view);
			$el.transition({ opacity: 0 }, function() {
				$el.hide();
				that.currentFragment = Backbone.history.fragment;
				that.currentView = view;

				that.currentView.render();
				that.currentView.$el.show().transition({ opacity: 1 });
			});
		} else {
			that.currentFragment = Backbone.history.fragment;
			that.currentView = view;
			that.currentView.render();
			that.currentView.$el.show().transition({ opacity: 1 });
		}


		console.groupEnd();
	},


	showPageBegin: function () {
		this.switchPage("begin", "#page-begin");
	},

	showPageDetails: function () {
		this.switchPage("details", "#page-details");
	},

	showPageSubmit: function () {
		this.switchPage("submit", "#page-submit");
	},

	showPageImages: function () {
		this.switchPage("images", "#page-images");
	},


	showPageInfo: function () {
		this.switchPage("info", "#page-info");
	},

	showPageMaps: function () {
		this.switchPage("maps", "#page-maps");
	},

	showPageFinish: function() {
		this.switchPage("finish", "#page-finish");
	}
})


module.exports = Backbone.View.extend({
	model: new app.models.classified,

	initialize: function(obj) {
		console.log("[view:classified-post] initializing");

		app.loadResource("dropzone");
		app.loadResource("googleMaps");
		app.loadResource("reCaptcha");
	},

	render: function() {
		console.log("[view:classified-post] rendering");
		/* I really don't like to do this.. but Backbone refuses to create
		 * multiple instances of this router and new ones don't have any effect.
		 * This hack is abit dirty and a solution should be found soon */
		if(!window.router) window.router = new router({
			$el: this.$el,
			model: this.model
		});
		else {
			window.router.$el = this.$el;
			window.router.model = this.model;
			window.router.views = [];
		}
		window.router.startup();
	},

	close: function() {
		this.$el.empty();
		this.$el.off();
		this.stopListening();
		this.router.close();
	}
});