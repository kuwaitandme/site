var braintree = require('braintree');

var	config = require('../../config');


module.exports = {
	perkPrices: [
		{ price:5, toggled: false},
		{ price:15, toggled: false}
	],

	createGateway: function() {
		return braintree.connect({
			environment: braintree.Environment.Sandbox,
			merchantId: config.braintree.merchantId,
			publicKey: config.braintree.publicKey,
			privateKey: config.braintree.privateKey
		});
	},


	getClientToken: function(callback) {
		var gateway = this.createGateway();

		gateway.clientToken.generate({}, function (err, response) {
			if(err) throw err;

			callback(response.clientToken);
		});
	},


	calculatePrice: function(POSTdata) {
		var price = 0;
		if(POSTdata["perk-0"] == "true") price += this.perkPrices[0].price;
		if(POSTdata["perk-1"] == "true") price += this.perkPrices[1].price;

		return price;
	},


	performTransaction: function(POSTdata, callback) {
		var price = this.calculatePrice(POSTdata);
		var gateway = this.createGateway();
		var nonce = POSTdata.payment_method_nonce;

		console.log(price, nonce);
		if(price != 0 || !nonce) callback()
		else {
			gateway.transaction.sale({
				amount: price,
				paymentMethodNonce: nonce,
			}, function (err, result) {
				console.log(err, result);
				callback();
			});
		}
	}
}