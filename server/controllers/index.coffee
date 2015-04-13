module.exports =
  passport: require './passport'
  helpers:  require './helpers'

  routes: (router) ->
    (require './api').routes router, '/api'
    (require './pages').routes router, ''