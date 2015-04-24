bootable = require 'bootable'
path     = require 'path'

exports = module.exports = (IoC, settings) ->
  app = this

  # api
  # app.phase bootable.di.routes './api.coffee'


  app.phase bootable.di.routes path.join __dirname, 'home'

  # # auth
  # app.phase bootable.di.routes './auth.coffee'

  # # my-account
  # app.phase bootable.di.routes './my-account.coffee'

  # # users
  # app.phase bootable.di.routes './users.coffee'

  # error handler (always keep this last)
  app.phase ->
    errorHandler = IoC.create 'igloo/error-handler'
    app.use errorHandler

exports['@require'] = [
  '$container'
  'igloo/settings'
]