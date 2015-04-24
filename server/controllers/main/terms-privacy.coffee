# Controller for the privacy page. Simply displays the privacy policy view.
exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    args =
      page: 'terms-privacy'
      title: response.__ 'title.terms-privacy'

    renderer request, response, args, true

exports['@require'] = [ 'controllers/renderer' ]
exports['@singleton'] = true