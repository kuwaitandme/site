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


	switchView: function(view) {
		var that = this;
		$("ul.error-message li").remove();

		if(!this.currentView) this.currentView = view;

		if(!this.currentView.validate())
			return this.navigate(this.currentFragment, {trigger: false});

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
		if(!this.views.begin) this.views.begin = new views.begin({
			el: "#page-begin",
			model: this.model
		});
		this.switchView(this.views.begin);
	},

	showPageDetails: function () {
		if(!this.views.details) this.views.details = new views.details({
			el: "#page-details",
			model: this.model
		});
		this.switchView(this.views.details);
	},

	showPageSubmit: function () {
		if(!this.views.submit) this.views.submit = new views.submit({
			el: "#page-submit",
			model: this.model
		});
		this.switchView(this.views.submit);
	},

	showPageImages: function () {
		if(!this.views.images) this.views.images = new views.images({
			el: "#page-images",
			model: this.model
		});
		this.switchView(this.views.images);
	},


	showPageInfo: function () {
		if(!this.views.info) this.views.info = new views.info({
			el: "#page-info",
			model: this.model
		});
		this.switchView(this.views.info);
	},

	showPageMaps: function () {
		if(!this.views.maps) this.views.maps = new views.maps({
			el: "#page-maps",
			model: this.model
		});
		this.switchView(this.views.maps);
	},

	showPageFinish: function() {
		if(!this.views.finish) this.views.finish = new views.finish({
			el: "#page-finish",
			model: this.model
		});
		this.switchView(this.views.finish);
	}
})


module.exports = Backbone.View.extend({
	model: new app.models.classified,

	initialize: function(obj) {
		this.router = new router({ model: this.model });
	},

	render: function() { }
});