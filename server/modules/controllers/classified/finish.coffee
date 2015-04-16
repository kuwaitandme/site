controller = module.exports =
  get: (request, response, next) ->
      args =
        page: 'classified/finish'
        title: response.__ 'title.classified.finish'

      render = global.modules.renderer
      render request, response, args, true