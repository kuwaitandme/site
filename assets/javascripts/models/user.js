module.exports = Backbone.Model.extend({
	defaults: {
		/* Main info */
		username: "",
		email: "",

		/* Admin related settings */
		adminReason: "",
		isAdmin: Boolean,
		language: 0,
		lastLogin: [""],
		status: 0, /* 0:Inactive,1:Active,2:Banned */

		/* Personal information */
		personal: {
			name: "",
			address: "",
			gender: 0,
			location: 0,
			phone: "",
			website: "",
			email: "",
		}
	}),


	/**
	 * Initializes the model.
	 */
	initialize: function() {
		// this.bind('set', this.filterParameters)
	},


	authenticate: function(username, password) {

	},


	/**
	 * Fetches the details of the user with the given id and save it in this
	 * model.
	 *
	 * @param     Number  id      The id of the user to fetch detail from
	 */
	fetch: function(id){
		console.debug("Fetching user data");
		var that = this;

		$.ajax({
			type: "POST",
			url: app.config.host + "/user/" + id,
			dataType: "json",
			beforeSend: ajax.setHeaders,
			success: function(response) {
				console.debug("Got user data", response);

				/* Save the data from the server */
				this.set(response);

				/* Signal any listeners that we are done loading the user */
				that.trigger("ajax:done", response);
			}, error: function(e) {
				console.error("Error fetching user data", e);
			},
		});
	},
});