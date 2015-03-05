// // var classifiedFinish = require('../classified/finish');

// module.exports = classifiedFinish.extend({
// 	render: function() {
// 		var template = _.template($("#list-template").html());

// 		var html = template(this.post);
// 		$("#classified-sample").html(html);

// 		$(".page").css('min-height', $(window).height() * 0.7 - 90);

// 		/* Generate the QR code. The QR code will contain the link edit to the
// 		 *  guest classified.
// 		 */
// 		var url = document.URL;
// 		url = url.replace("finish", "single")

// 		$("#qrcode").qrcode(url);
// 		$("#qrlink").attr('href', url);
// 	}
// });