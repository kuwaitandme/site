module.exports =

  forgot:     require './forgot'
  login:      require './login'
  logout:     require './logout'
  reset:      require './reset'
  signup:     require './signup'

  routes: (router, localizedUrl) ->
    router.get (localizedUrl "/auth/forgot"),   @forgot.get
    router.get (localizedUrl "/auth/login"),    @login.get
    router.get (localizedUrl "/auth/logout"),   @logout.get
    router.get (localizedUrl "/auth/reset"),    @reset.get
    router.get (localizedUrl "/auth/signup"),   @signup.get