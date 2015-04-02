module.exports =
  get: require './get'

  routes: (router, base) -> router.get "#{base}/lang/:id", @get