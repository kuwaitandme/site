paypal    = require "paypal-rest-sdk"
Promise   = require "bluebird"
validator = require "validator"


exports = module.exports = (IoC, settings, Transactions) ->
  logger = IoC.create "igloo/logger"
  name = "[api:paypal]"

  # Perform some validation on the fields
  validate = (request) -> new Promise (resolve, reject) ->
    details = request.body or {}
    details.user = request.user
    details.amount = "10"
    details.credits = 100
    details.description = "100 credits for 10USD"
    if not details.user or not details.user.id?
      return reject new Error "need login"
    if not details.amount? or not validator.isInt details.amount
      return reject new Error "bad/missing field 'amount'"
    if not details.description?
      return reject new Error "bad/missing field 'description'"
    resolve details


  callPaypal = (details) -> new Promise (resolve, reject) ->
    # prepare the JSON that gets sent to the API
    paymentJSON =
      intent: "sale"
      payer: payment_method: "paypal"
      redirect_urls:
        return_url: "#{settings.url}/api/payments/callback?status=approved"
        cancel_url: "#{settings.url}/api/payments/callback?status=cancelled"
      transactions: [
        amount:
          currency: settings.paypal.currency
          total: String details.amount or 0
          details:
            subtotal: String details.amount or 0
            tax: 0
            shipping: 0
        description: String details.description or ""
      ]

    # Send request to the paypal API to initiate the transaction.
    paypal.payment.create paymentJSON, settings.paypal, (error, response) ->
      if error then reject error
      if response then resolve [details, response]
        # logger.debug name, "got response from paypal"
        # for link in res.links
        #   if link.rel is "approval_url"
        #     logger.debug name, "redirecting to approval link"
        #     return response.redirect link.href
        # # response.json res
        # response.json {}


  createTransaction = (details, paypalResponse) ->
    new Promise (resolve, reject) ->
      properties =
        amount: details.amount
        credits: details.credits
        paypal_id: paypalResponse.id
        state: Transactions.states.CREATED
        user: details.user.id
      Transactions.create properties, (error, transaction) ->
        if error then reject error
        else resolve [paypalResponse, transaction]


  controller = (request, response, next) ->
    logger.debug "processing transaction"

    Promise.resolve request
    .then validate
    .then callPaypal
    .spread createTransaction

    .spread (paypalResponse, transaction) ->
      redirectURL = ""
      for link in paypalResponse.links
        if link.rel is "approval_url"
          logger.debug name, "redirecting to approval link"
          redirectURL = link.href
      response.json
        transaction: transaction.toJSON()
        redirect: redirectURL

    # If there were any errors, return it with a default 400 HTTP code.
    .catch (error) ->
      logger.error error.stack
      response.status error.status || 400
      response.json error.message


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/settings"
  "models/transactions"
]