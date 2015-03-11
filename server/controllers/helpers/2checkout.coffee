Twocheckout = require('2checkout-node')
config = global.config
transactions = global.models.transactions

module.exports =
	getObject: ->
		new Twocheckout(
			sellerId: config._2checkout.sid
			privateKey: config._2checkout.privateKey
			sandbox: config._2checkout.sandbox)

	processTransaction: (id, params, callback) ->
		transaction = new (transactions.model)
		transaction.classified = id
		transaction.success = false
		transaction.total = params.total
		params.merchantOrderId = transaction._id
		tco = @getObject()
		tco.checkout.authorize params, (err, data) ->
			if not err then transaction.success = true

			if data and data.responseCode == 'APPROVED'
				transaction.twoCheckoutTransId = data.transactionId
				transaction.orderNumber = data.orderNumber
				transaction.save()
				callback(err, data, transaction)
			else callback err, data, null