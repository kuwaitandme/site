var model = Backbone.Model.extend({
	defaults: {
		_id: null,
		name: ""
	},
});

module.exports = Backbone.Collection.extend({
	model: model,
	initialize: function() {
		this.fetch();
	},
	fetch: function(){
		this.set(window.locations);
	},
});