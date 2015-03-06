module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.model = options.model;
	},

	render: function() { },

	validate: function() { return true; }
});