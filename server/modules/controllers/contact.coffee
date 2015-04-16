# Controller for the privacy page. Simply displays the privacy policy view.
controller = module.exports =
  get: (request, response, next) ->
    args =
      page: 'contact'
      title: response.__ 'title.contact'

    render = global.modules.render
    render request, response, args, true


  routes: (router, localizedUrl) -> router.get (localizedUrl '/contact'), @get