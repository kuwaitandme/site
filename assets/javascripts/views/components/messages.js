module.exports = Backbone.View.extend({
	template: _.template('<li class="<%= type %>">\
		<b class="title"><%= title %></b>&nbsp;\
		<span class="content"><%= text %></span>\
	</li>'),


	initialize: function() {
		this.$message = this.$el.find('.content');
		this.$title = this.$el.find('.title');
	},


	success: function(text, title) {
		var html = this.template({
			text: text,
			title: title || 'Success!',
			type: 'success'
		});

		/* Animate the message box */
		this.$el.append(html);
	},


	clear: function() {
		this.$el.html("");
	},


	error: function(text, title) {
		var html = this.template({
			text: text,
			title: title || 'Error!',
			type: 'error'
		});

		/* Append to the message box */
		this.$el.append(html);
	},


	warn: function(text, title) {
		var html = this.template({
			text: text,
			title: title || 'Warning!',
			type: 'warning'
		});

		/* Animate the message box */
		this.$el.append(html);
	}
});