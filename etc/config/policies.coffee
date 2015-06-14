# app - policies
_                  = require "underscore"
auth               = require "basic-auth"
connectEnsureLogin = require "connect-ensure-login"

exports = module.exports = (IoC, User) ->

  # policy/middleware helpers
  ensureLoggedIn  = connectEnsureLogin.ensureLoggedIn
  ensureLoggedOut = connectEnsureLogin.ensureLoggedOut

  policies =
    ensureLoggedIn:    ensureLoggedIn
    ensureLoggedOut:   ensureLoggedOut
    ensureApiToken:    ensureApiToken
    notApiRouteRegexp: /^(?!\/api\/).*$/
    adminRouteRegexp:  /^(\/admin).*$/

  # since there are issues with `passport-http` right now
  # this is implemented as a temporary solution
  ensureApiToken = (request, response, next) ->
    creds = auth request
    if not creds or not _.isString creds.name
      response.statusCode = 401
      return next
        message: "API token missing"
        param: "username"
    User.findOne { api_token: creds.name }, (err, user) ->
      if err then return next err
      if !user then return next
        message: "Invalid API token provided"
        param: "username"
      request.user = user
      next()

  policies

exports["@singleton"] = true
exports["@requestuire"] = [
  "$container"
  "models/user"
]
