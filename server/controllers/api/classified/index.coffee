module.exports =
  delete: require './get'
  get:    require './get'
  post:   require './post'
  put:    require './put'
  patch:  require './patch'

  routes: (router, base) ->
    router.delete   base + '/classified/:id?', @delete
    router.get      base + '/classified/:id?', @get
    router.post     base + '/classified', @post
    router.put      base + '/classified', @put
    router.patch    base + '/classified/:id?', @patch