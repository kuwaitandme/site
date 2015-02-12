module.exports = Backbone.View.extend({
	// template: Templates["admin.single"],
	state: false,
	height: 51,

	events: {
		"click #mobile-admin-grabber" : "toggleMobile"
	},


	/**
	 * Toggles the mobile nav.
	 */
	toggleMobile: function() {
		if((this.state = !this.state)) this.show();
		else this.hide();
	},

	/**
	 * Hide the adminbar for mobile
	 */
	hide: function() {
		this.$adminBar.height(0);
	},


	/**
	 * Show the adminbar
	 */
	show: function() {
		this.$adminBar.height(this.height);
	},


	initialize: function (obj) {
		this.render(obj.editable, obj.superEditable);
	},


	getControls: function(editable, superEditable) {
		var controls = [];
		if(superEditable || editable) {
			if(superEditable) {
				controls.push("publish", "reject", "ban");
				this.height = 102;
			}

			controls.push("archive", "repost", "edit");
			// controls.push("archive", "repost");
		}
		return controls;
	},

	render: function(editable, superEditable) {
		var controls = this.getControls(editable, superEditable);
		this.$el.html(this.template({
				controls: controls
			})
		);
		this.$adminBar = this.$el.find("#mobile-admin-panel");
	}
});