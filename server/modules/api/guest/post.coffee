classified = global.models.classified

controller = module.exports =
  get: (request, response, next) ->

    render = global.modules.renderer
    render request, response,
      bodyid: 'guest-post'
      description: null
      page: 'classified/post'
      title: response.__('title.guest.post')

      data:
        guest: true
        sitekey: config.reCaptcha.site