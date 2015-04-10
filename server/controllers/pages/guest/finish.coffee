controller = module.exports =
  get: (request, response, next) ->
      args =
        page: 'classified/finish'
        title: response.__('title.classified.finish')

      render = global.helpers.render
      render request, response, args, true