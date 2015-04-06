Twocheckout = require('2checkout-node')
config = global.config
transactions = global.models.transactions

module.exports =
  getObject: ->
    # console.log
    #   sellerId: config._2checkout.sid
    #   privateKey: config._2checkout.privateKey
    #   sandbox: config._2checkout.sandbox
    new Twocheckout
      sellerId: config._2checkout.sid
      privateKey: config._2checkout.privateKey
      sandbox: config._2checkout.sandbox

  processTransaction: (credits, params, callback) ->
    transaction = new transactions.model
    transaction.credits = credits
    transaction.success = false
    transaction.total = params.total

    params.merchantOrderId = String transaction._id
    tco = @getObject()

    tco.checkout.authorize params, (error, data) ->
      # console.log (error ), data, params
      if error then return callback error.message

      if data and data.responseCode == 'APPROVED'
        transaction.success = true
        transaction.twoCheckoutTransId = data.transactionId
        transaction.orderNumber = data.orderNumber

        transaction.save()
        callback error, data, transaction
      else callback error, data, null