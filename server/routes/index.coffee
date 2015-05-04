bootable = require "bootable"
path     = require "path"

exports = module.exports = (IoC) ->
  app = this

  app.phase bootable.di.routes path.join __dirname, "api"
  app.phase bootable.di.routes path.join __dirname, "main"

  # error handler (always keep this last)
  app.phase ->
    errorHandler = IoC.create "igloo/error-handler"
    app.use errorHandler

exports["@require"] = ["$container"]