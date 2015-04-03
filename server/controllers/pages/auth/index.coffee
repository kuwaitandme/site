module.exports =
  get: (request, response, next) -> response.redirect '/auth/login'

  forgot:     require './forgot'
  login:      require './login'
  logout:     require './logout'
  reset:      require './reset'
  signup:     require './signup'

  routes: (router, base) ->
    router.get base + '/auth',          @get
    router.get base + '/auth/forgot',   @forgot.get
    router.get base + '/auth/login',    @login.get
    router.get base + '/auth/logout',   @logout.get
    router.get base + '/auth/reset',    @reset.get
    router.get base + '/auth/signup',   @signup.get