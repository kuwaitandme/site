# Controller for the privacy page. Simply displays the privacy policy view.
controller = module.exports =
  get: (request, response, next) ->
    args =
      page: 'about'
      title: response.__ 'title.about'

    render = global.modules.renderer
    render request, response, args, true

  routes: (router, localizedUrl) -> router.get (localizedUrl '/about'), @get