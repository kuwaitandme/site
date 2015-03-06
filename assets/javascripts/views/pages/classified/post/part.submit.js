module.exports = Backbone.View.extend({
	events: {
		"click .submit" : "submit"
	},

	initialize: function(options) {
		this.$submit = this.$el.find(".submit");
		this.listenTo(this.model, "ajax:error", this.ajaxError);
	},


	render: function() {
		this.spinner = new app.views.components.spinner();
	},


	/**
	 * Checks all the required fields in that particular page and prevents the
	 * page from scrolling if any of the fields are empty.
	 *
	 * @param  Event e         The click event object
	 */
	validate: function () {
		this.$gcaptcha = $('#g-recaptcha-response');

		var val = this.$gcaptcha.val();
		if(!val || val == "") {
			this.model.trigger('post:error', "Please fill in the captcha properly");
			return false;
		}

		return true;
	},


	/**
	 * Sends the AJAX request to the back-end
	 *
	 * @param  Event   event      The event object that gets fired.
	 */
	submit: function(event) {
		event.preventDefault();
		if(!this.validate()) return;

		this.$submit.hide();
		this.spinner.show();

		this.model.uploadServer();
	},


	ajaxError: function(e) {
		this.$submit.show();
		this.spinner.hide();
		this.model.trigger('post:error', e.statusText);
	}
});