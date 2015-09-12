ddos   = require "ddos"
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
  if settings.csrf.enabled and false
    app.use (request, response, next) ->
      if request.headers["x-phonegap"] is settings.phonegap.csrfBypassKey or
      request.xhr
        return next()
      (csrf settings.csrf.options) request, response, next

  # Add a DDoS middleware; to protect against DDoS attacks. Add the middleware
  # if we are not in development mode..
  isDevelopment = settings.server.env == "development"
  if not isDevelopment then app.use (new ddos maxcount: 50).express


exports["@require"] = [
  "$container"
  "igloo/settings"
  "policies"
]
