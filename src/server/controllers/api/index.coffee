exports = module.exports = ->
  controller = (request, response, next) ->
    response.contentType "application/json"
    data =
      authors: [
        "Steven Enamakel" : {
          role: "founder"
          email: "founder@kuwaitandme.com"
        }
      ]
      description: "This is the API for communicating with all frontend apps"
      # magic: config.magic
      status: "online"
    response.end JSON.stringify data, null, 2