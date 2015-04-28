# app - policies
_                  = require 'underscore'
auth               = require 'basic-auth'
connectEnsureLogin = require 'connect-ensure-login'

exports = module.exports = (IoC, User) ->

  # policy/middleware helpers
  ensureLoggedIn = connectEnsureLogin.ensureLoggedIn
  ensureLoggedOut = connectEnsureLogin.ensureLoggedOut

  policies =
    ensureLoggedIn: ensureLoggedIn
    ensureLoggedOut: ensureLoggedOut
    ensureApiToken: ensureApiToken
    notApiRouteRegexp: /^(?!\/api\/).*$/
    adminRouteRegexp: /^(\/admin).*$/

  # since there are issues with `passport-http` right now
  # this is implemented as a temporary solution
  ensureApiToken = (req, res, next) ->
    creds = auth(req)
    if !creds or !_.isString creds.name
      res.statusCode = 401
      return next
        message: 'API token missing'
        param: 'username'
    User.findOne { api_token: creds.name }, (err, user) ->
      if err then return next err
      if !user then return next
        message: 'Invalid API token provided'
        param: 'username'
      req.user = user
      next()

  policies

exports['@singleton'] = true
exports['@require'] = [
  '$container'
  'models/user'
]