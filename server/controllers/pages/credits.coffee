# Controller for the privacy page. Simply displays the privacy policy view.
controller = module.exports =
  get: (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect '/auth/login?error=need_login'

    args =
      page: 'credits'
      title: response.__('title.credits')
      templates: [
        "credits"
      ]
    render = global.helpers.render
    render request, response, args, true


  routes: (router, base) -> router.get base + '/credits', @get