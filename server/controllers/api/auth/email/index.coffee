module.exports =
  postLogin:   require './post-login'
  postSignup:  require './post-signup'
  put:         require './put'
  patch:       require './patch'

  routes: (router, base) ->
    router.patch    base + '/email/:email?', @patch
    router.post     base + '/email',         @postSignup
    router.post     base + '/email/:email?', @postLogin
    router.put      base + '/email/:id?', @put