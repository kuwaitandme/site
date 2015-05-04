helmet = require "helmet"
csrf   = require "csurf"


exports = module.exports = (IoC, settings, policies) ->
  app = this
  # trust proxy
  if settings.trustProxy then app.enable "trust proxy"

  # use helmet for security
  app.use helmet()

  # cross site request forgery prevention (csrf)
  # note: disabled automatically for XHR (AJAX) requests
  # and requests with `/api` prefixed route path
  if settings.csrf.enabled
    app.all policies.notApiRouteRegexp, (req, res, next) ->
      if req.xhr then return next()
      csrf(settings.csrf.options) req, res, next

exports["@require"] = [
  "$container"
  "igloo/settings"
  "policies"
]