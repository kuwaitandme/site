config = require('../../config');

module.exports = {
	getObject: function() {
		return new Twocheckout({
			sellerId: config._2checkout.sid,
			privateKey: config._2checkout.privateKey,
			sandbox: true   // Uncomment to use Sandbox
		});
	},

	processTransaction: function (params, callback) {
		var tco = this.getObject();
		tco.checkout.authorize(params, callback);
	}
}