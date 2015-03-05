module.exports = Backbone.View.extend({
	initialize: function(obj) {
		this.model = obj.model;
	},

	render: function() { },

	validate: function() { return true; }
});