validator = require "validator"


Middleware = module.exports = (BadParameters) ->
  (request, response, next, value) ->
    if /([0-9a-zA-Z\_]+)/.test value then next()
    else next new BadParameters()


Middleware["@singleton"] = true
Middleware["@require"] = ["libraries/errors/BadParameters"]