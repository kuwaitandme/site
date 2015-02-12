module.exports = Backbone.View.extend({
	defaultDelay: 5000,

	initialize: function() {
		this.$message = this.$el.find(".message");
	},


	/**
	 * Displays the message on the message box, with the given delay. If no
	 * delay is mentioned, then the defalu delay is used (5 sec).
	 */
	shout: function(text, delay) {
		/* Set the delay to default, if none has been passed */
		if(!delay) delay = this.defaultDelay;

		/* Animate the message box */
		this.$message.text(text);
		this.$el.stop().fadeIn().delay(delay).fadeOut();
	}
});