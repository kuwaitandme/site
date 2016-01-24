cachemanMemory     = require "cacheman-memory"
helmet             = require "helmet"
path               = require "path"


exports = module.exports = (IoC, settings) ->
  app = this

  # Disable cache if settings say so
  if not settings.cache then app.use helmet.nocache()
  else
    # Enable cache if NOT an XHR (AJAX) request
    app.use (req, res, next) ->
      if req.xhr then return next()
      res.setHeader "Cache-Control", "public"
      res.setHeader "Pragma", ""
      res.setHeader "Expires", settings.staticServer.maxAge
      next()


exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true