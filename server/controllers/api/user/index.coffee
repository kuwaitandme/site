module.exports =
  delete: require './get'
  get:    require './get'
  post:   require './get'
  put:    require './put'

  routes: (router, base) ->
    router.delete   base + '/user/:id?', @delete
    router.get      base + '/user/:id?', @get
    router.post     base + '/user/:id?', @post
    router.put      base + '/user/'    , @put