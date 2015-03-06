module.exports = Backbone.Collection.extend({
	model: Backbone.Model.extend({
		defaults: {
			_id: null,
			children : [{ _id: null, name: "", count: 0}],
			count: 0,
			name: ""
		},
	}),

	initialize: function() {
		console.log("[model:categories] initializing", window.categories);
		this.set(window.categories);
	}
});