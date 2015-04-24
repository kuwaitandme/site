module.exports =
  manage:  require './manage'
  profile: require './profile'
  credits: require './credits'

  get: (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect '/auth/login?error=need_login'

    args =
      page: 'account/index'
      title: response.__ 'title.account'

    render = global.modules.renderer
    render request, response, args, true


  routes: (router, localizedUrl) ->
    router.get (localizedUrl '/account'),         @get
    router.get (localizedUrl '/account/manage'),  @manage.get
    router.get (localizedUrl '/account/credits'), @credits.get
    router.get (localizedUrl '/account/profile'), @profile.get