module.exports =
  passport: require './passport'
  helpers:  require './helpers'

  routes: (router) ->
    (require './pages').routes(router, '')
    (require './api').routes(router, '/api')