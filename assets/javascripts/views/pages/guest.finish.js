module.exports = Backbone.View.extend({
	initialize: function(obj) {
		this.render();
	},

	render: function() {
		/* Generate the QR code. The QR code will contain the link edit to the
		 *  guest classified.
		 */
		var url = document.URL;
		url = url.replace("finish", "edit")

		$("#qrcode").qrcode(url);
		$("#qrlink").attr('href', url);
	}
});