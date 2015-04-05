# Controller for the privacy page. Simply displays the privacy policy view.
controller = module.exports =
  get: (request, response, next) ->
    args =
      page: 'contact'
      title: response.__('title.contact')

    render = global.helpers.render
    render request, response, args, true


  routes: (router, base) -> router.get base + '/contact', @get