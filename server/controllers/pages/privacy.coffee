# Controller for the privacy page. Simply displays the privacy policy view.
controller = module.exports =
  get: (request, response, next) ->
    args =
      bodyid: 'privacy'
      page: 'privacy'
      title: response.__('title.privacy')

    render = global.helpers.render
    render request, response, args, true


  routes: (router, base) -> router.get base + '/privacy', @get