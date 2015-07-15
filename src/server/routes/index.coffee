bootable = require "bootable"
path     = require "path"

exports = module.exports = (IoC, settings) ->
  app = this
  app.phase bootable.di.routes path.join __dirname, "api"
  app.phase bootable.di.routes path.join __dirname, "main"

  # error handler (always keep this last)
  app.phase -> app.use IoC.create "controllers/errors/5XX"


exports["@require"] = [
  "$container"
  "igloo/settings"
]
