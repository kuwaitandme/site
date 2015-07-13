paypal = require "paypal-rest-sdk"


exports = module.exports = (IoC, settings) ->
  logger = IoC.create "igloo/logger"
  logger.debug "[init] configuring paypal API"
  paypal.configure settings.paypal


exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true
