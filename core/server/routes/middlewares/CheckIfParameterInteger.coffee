validator = require "validator"


Middleware = module.exports = (BadParameters) ->
  (request, response, next, value) ->
    if validator.isInt value then next()
    else next new BadParameters()


Middleware["@singleton"] = true
Middleware["@require"] = ["libraries/errors/BadParameters"]