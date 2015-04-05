module.exports =
  postLogin:   require './post-login'
  postSignup:  require './post-signup'
  put:         require './put'
  patch:       require './patch'
  get:         require './get-activate'

  routes: (router, base) ->
    router.get      base + '/email/activate/:id?', @get
    router.post     base + '/email',         @postSignup
    router.patch    base + '/email/:email?', @patch
    router.post     base + '/email/:email?', @postLogin
    router.put      base + '/email/:id?', @put