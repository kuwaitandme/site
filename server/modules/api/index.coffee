config = global.config

module.exports =
  get: (request, response, next) ->
    response.contentType 'application/json'
    response.end JSON.stringify
      author: 'Steven Enamakel'
      magic: config.magic
      status: 'online'


  routes: (router) ->
    base = '/api'
    router.get "#{base}/", @get
    (require './account')    .routes router, base
    (require './auth')       .routes router, base
    (require './category')   .routes router, base
    (require './contact')    .routes router, base
    (require './classified') .routes router, base
    (require './lang')       .routes router, base
    (require './location')   .routes router, base
    (require './query')      .routes router, base
    (require './user')       .routes router, base