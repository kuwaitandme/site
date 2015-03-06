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
		// "*": "showPageBegin",
		"*path": "showPageBegin",
	},


	initialize: function(obj) {
		var that = this;
		this.model = obj.model;

		this.listenTo(this.model, "ajax:done", function() {
			that.navigate("page-finish", {trigger: true});
		});

		this.listenTo(this.model, "post:error", function(message) {
			that.displayError(message)
		});
	},

	displayError: function(message) {
		this.currentView.$el.find("ul.error-message")
			.hide()
			.append("<li>" + message + "</li>")
			.fadeIn();
	},


	switchView: function(viewname, el) {
		var that = this;
		var view;

		/* If the view wasn't initialized already, initialize it */
		if(!this.views[viewname]) this.views[viewname] = new views[viewname]({
			el: el,
			model: this.model
		});
		view = this.views[viewname];

		/* Remove all error messages */
		$("ul.error-message li").remove();

		/* Set the current view variable */
		if(!this.currentView) this.currentView = view;

		/* If the view's validation function failed, stay in the same view */
		if(!this.currentView.validate())
			return this.navigate(this.currentFragment, {trigger: false});

		/* Animate and switch the DOM elements */
		var $el = this.currentView.$el;
		$el.transition({ opacity: 0 }, function() {
			$el.hide();
			that.currentFragment = Backbone.history.fragment;
			that.currentView = view;
			that.currentView.render();
			that.currentView.$el.show().transition({ opacity: 1 });
		});
	},


	showPageBegin: function () {
		this.switchView("begin", "#page-begin");
	},

	showPageDetails: function () {
		this.switchView("details", "#page-details");
	},

	showPageSubmit: function () {
		this.switchView("submit", "#page-submit");
	},

	showPageImages: function () {
		this.switchView("images", "#page-images");
	},


	showPageInfo: function () {
		this.switchView("info", "#page-info");
	},

	showPageMaps: function () {
		this.switchView("maps", "#page-maps");
	},

	showPageFinish: function() {
		this.switchView("finish", "#page-finish");
	}
})


module.exports = Backbone.View.extend({
	model: new app.models.classified,

	initialize: function(obj) {
		this.router = new router({ model: this.model });
	},

	render: function() {
		this.router.showPageBegin();
	}
});