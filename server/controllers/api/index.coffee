module.exports = ->
  controller = (request, response, next) ->
    response.contentType 'application/json'
    response.end JSON.stringify
      author: 'Steven Enamakel'
      # magic: config.magic
      status: 'online'