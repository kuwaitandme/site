var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var transactions = module.exports = {
	model: mongoose.model('transactions', {
		classified: ObjectId,
		name: String,
		perks: [Boolean],
		success: Boolean,
		total: Number,

		twoCheckoutTransId: String,
		orderNumber: String
	})
}