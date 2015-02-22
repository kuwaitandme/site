var Twocheckout = require('2checkout-node');
var config = require('../../config');
var transactions = require('../../models/transactions');

module.exports = {
	getObject: function() {
		return new Twocheckout({
			sellerId: config._2checkout.sid,
			privateKey: config._2checkout.privateKey,
			sandbox: config._2checkout.sandbox
		});
	},

	processTransaction: function (id, params, callback) {
		transaction = new transactions.model();

		transaction.classified = id;
		// transaction.perks = params.perks;
		transaction.success = false;
		transaction.total = params.total;
		params.merchantOrderId = transaction._id;

		console.log(params);

		var tco = this.getObject();
		tco.checkout.authorize(params, function(err, data) {
			if(err == null) transaction.success = true;

			// console.log(err);

			if(data && data.responseCode == 'APPROVED') {
				transaction.twoCheckoutTransId = data.transactionId;
				transaction.orderNumber = data.orderNumber;
				transaction.save();
				// console.log(err, data);
				return callback(err, data, transaction);
			}

			callback(err, data, null);
		});
	}
}