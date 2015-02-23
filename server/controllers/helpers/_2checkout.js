var Twocheckout = require('2checkout-node');
var config = require('../../config');
var transactions = require('../../models/transactions');

module.exports = {
	/**
	 * [getObject description]
	 *
	 * @return {[type]} [description]
	 */
	getObject: function() {
		return new Twocheckout({
			sellerId: config._2checkout.sid,
			privateKey: config._2checkout.privateKey,
			sandbox: config._2checkout.sandbox
		});
	},


	/**
	 * [processTransaction description]
	 *
	 * @param  {[type]}   id       [description]
	 * @param  {[type]}   params   [description]
	 * @param  {Function} callback [description]
	 */
	processTransaction: function (id, params, callback) {
		transaction = new transactions.model();

		transaction.classified = id;
		transaction.success = false;
		transaction.total = params.total;
		params.merchantOrderId = transaction._id;

		var tco = this.getObject();
		tco.checkout.authorize(params, function(err, data) {
			if(err == null) transaction.success = true;

			if(data && data.responseCode == 'APPROVED') {
				transaction.twoCheckoutTransId = data.transactionId;
				transaction.orderNumber = data.orderNumber;
				transaction.save();

				return callback(err, data, transaction);
			}

			callback(err, data, null);
		});
	}
}