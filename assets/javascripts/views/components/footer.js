module.exports = Backbone.View.extend({
	// template: Templates["footer"],

	render: function() {
		this.$el.html(this.template());
	}
});