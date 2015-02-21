var classifiedFinish = require('./classified.finish');

module.exports = classifiedFinish.extend({
	render: function() {
		var template = _.template($("#list-template").html());

		var html = template(this.post);
		$("#classified-sample").html(html);

		/* Generate the QR code. The QR code will contain the link edit to the
		 *  guest classified.
		 */
		var url = document.URL;
		url = url.replace("finish", "edit")

		$("#qrcode").qrcode(url);
		$("#qrlink").attr('href', url);
	}
});