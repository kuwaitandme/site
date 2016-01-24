_                  = require "underscore"
auth               = require "basic-auth"


Middleware = module.exports = (BadApiToken, User) ->
  (request, response, next) ->
    creds = auth request
    if not creds or not _.isString creds.name
      response.statusCode = 401
      return next new BadApiToken

    # User.findOne { api_token: creds.name }, (err, user) ->
    #   if err then return next err
    #   if !user then return next
    #     message: "Invalid API token provided"
    #     param: "username"
    #   request.user = user
    #   next()
    next()


Middleware["@singleton"] = true
Middleware["@require"] = [
  "libraries/errors/BadApiToken"
  "models/user"
]