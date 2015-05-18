paypal = require "paypal-rest-sdk"

exports = module.exports = (IoC, settings) ->
  logger = IoC.create "igloo/logger"

  returnURL = "#{settings.url}/api/payments/callback?status=return"
  cancelURL = "#{settings.url}/api/payments/callback?status=cancelled"

  # Move this to init
  paypal.configure settings.paypal

  controller = (request, response, next) ->
    logger.debug "processing transaction"
    details = request.body or {}

    paymentJSON =
      intent: "sale"
      payer: payment_method: "paypal"
      redirect_urls: return_url: returnURL, cancel_url: cancelURL
      transactions: [
        amount:
          currency: "USD"
          total: String details.amount or 10
        description: String details.description or ""
      ]

    paypal.payment.create paymentJSON, settings.paypal, (err, res) ->
      if err then console.error err
      if res
          console.log "Create Payment Response"
          console.log res
          for link in res.links
            console.log link
            if link.rel is "approval_url"
              return response.redirect link.href
          response.json res


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/settings"
]