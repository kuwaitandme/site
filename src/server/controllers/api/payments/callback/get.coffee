# paypal = require "paypal-rest-sdk"

# exports = module.exports = (IoC, settings) ->
#   logger = IoC.create "igloo/logger"
#   name = "[api:paypal]"

#   controller = (request, response, next) ->
#     logger.debug "executing transaction"
#     details = request.body or {}

#     query = request.query or {}
#     paymentID = query.paymentId
#     token = query.token
#     payerID = query.PayerID

#     executeDetails = payer_id: payerID
#     paypal.payment.execute paymentID, executeDetails, (error, payment) ->
#       if error then response.json error
#       else response.json payment


# exports["@singleton"] = true
# exports["@require"] = [
#   "$container"
#   "igloo/settings"
# ]
