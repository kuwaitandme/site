express   = require 'express'
passport  = require 'passport'

router    = express.Router()

module.exports = (app) ->
  api = global.modules.api
  api.routes router

  controllers = global.modules.controllers
  controllers.routes router

  app.use router