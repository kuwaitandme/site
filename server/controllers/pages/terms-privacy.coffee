# Controller for the privacy page. Simply displays the privacy policy view.
controller = module.exports =
  get: (request, response, next) ->
    args =
      page: 'terms-privacy'
      title: response.__ 'title.terms-privacy'

    render = global.helpers.render
    render request, response, args, true


  routes: (router, localizedUrl) -> router.get (localizedUrl '/terms-privacy'), @get