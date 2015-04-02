classified = global.models.classified

controller = module.exports =
  get: (request, response, next) ->
    args =
      data: guest: true
      description: null
      page: 'classified/post'
      title: response.__('title.guest.post')
      templates: [
        "classified/post"
      ]
    render = global.helpers.render
    render request, response, args, true