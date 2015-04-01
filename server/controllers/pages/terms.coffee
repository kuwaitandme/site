# Controller for the terms and conditions page. Simply displays the 'terms and
# conditions' view.
controller = module.exports =
  get: (request, response, next) ->
    args =
      bodyid: 'terms'
      page: 'terms'
      title: response.__('title.terms')

    render = global.helpers.render
    render request, response, args, true


  routes: (router, base) -> router.get base + '/terms', @get