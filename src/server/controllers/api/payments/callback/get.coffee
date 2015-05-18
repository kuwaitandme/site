paypal = require "paypal-rest-sdk"

# var querystring = require('querystring');

# var data = querystring.stringify({
#       username: yourUsernameValue,
#       password: yourPasswordValue
#     });

# var options = {
#     host: 'my.url',
#     port: 80,
#     path: '/login',
#     method: 'POST',
#     headers: {
#         'Content-Type': 'application/x-www-form-urlencoded',
#         'Content-Length': Buffer.byteLength(data)
#     }
# };

exports = module.exports = (IoC, settings) ->
  logger = IoC.create "igloo/logger"

  returnURL = "#{settings.url}/payments/callback?status=return"
  cancelURL = "#{settings.url}/payments/callback?status=cancelled"



  controller = (request, response, next) ->
    logger.debug "executing transaction"
    details = request.body or {}

    query = request.query or {}
    paymentID = query.paymentId
    token = query.token
    payerID = query.PayerID

    executeDetails = payer_id: payerID
    abv = settings.paypal
    abv.payer_id  = payerID
    console.log executeDetails
    paypal.payment.execute paymentID, executeDetails, (error, payment) ->
      if error then response.json error
      else response.json payment

    # paymentJSON =
    #   intent: "sale"
    #   payer: payment_method: "paypal"
    #   redirect_urls: return_url: returnURL, cancel_url: cancelURL
    #   transactions: [
    #     amount:
    #       currency: "USD"
    #       total: String details.amount or 1
    #     description: String details.description or ""
    #   ]
    # response.json request.query
    # paypal.payment.create paymentJSON, settings.paypal, (err, res) ->
    #   if err then console.error err
    #   if res
    #       console.log "Create Payment Response"
    #       console.log res
    #       for link in res.links
    #         console.log link
    #         if link.rel is "approval_url"
    #           return response.redirect link.href
    #       response.json res


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/settings"
]