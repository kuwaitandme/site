module.exports = Backbone.View.extend({
	slug: "page-auth",
	title: "Post a Classified",
	// template: Templates["auth.post"],

	render: function() {
		this.$el.html(this.template());
	},
});