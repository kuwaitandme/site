module.exports = Backbone.View.extend({
	initialize: function(obj) {
		this.render();
	},

	render: function() {
		/* Generate the QR code. The QR code will contain the link edit to the
		 *  guest classified.
		 */
		var qrcode = new QRCode("qrcode");
		qrcode.makeCode(window.url);
	}
});