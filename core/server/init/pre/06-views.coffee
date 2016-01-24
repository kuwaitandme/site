_ = require "underscore"


exports = module.exports = (IoC, settings, Renderer) ->
  app = this
  name = "[views]"
  logger = IoC.create "igloo/logger"
  logger.verbose name, "initializing"

  #! Re-write jade with our custom renderer
  app.engine "jade", Renderer

  #! Set the default view engine.
  app.set "view engine", "jade"

  #! Setup a middleware to handle JSON requests.
  app.use (request, response, next) ->
    #! grab reference of render
    _render = response.render

    #! override logic
    response.render = (view, options={}, callback) ->
      if request.query.json? then response.json options.data
      else _render.call this, view, options, callback

    next()


exports["@require"] = [
  "$container"
  "igloo/settings"
  "libraries/renderer"
]
exports["@singleton"] = true