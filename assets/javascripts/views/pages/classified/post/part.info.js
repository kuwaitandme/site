var xss = require('xss');

module.exports = Backbone.View.extend({
	initialize: function(obj) {
		this.model = obj.model;

		/* Setup our DOM variables */
		this.$description = this.$el.find("#description");
		this.$title = this.$el.find("#title");

		/* Initialize redactor */
		this.$description.redactor();
	},


	render: function() { },

	validate: function () {
		var ret = true;

		var $els = this.$el.find("[required]");
		$els.removeClass('error');
		$els.each(function(i) {
			var $el = $els.eq(i);
			if(!$el.val()) {
				$el.addClass('error');
				ret = false;
			}
		});

		if(!ret) {
			this.model.trigger('post:error', "Some of the fields are missing");
			return false;
		}

		this.setModel();
		return true;
	},

	setModel: function() {
		this.model.set({
			description: xss(this.$description.val()),
			title: xss(this.$title.val())
		});
	}
});