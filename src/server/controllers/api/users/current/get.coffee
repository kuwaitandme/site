module.exports = ->
  controller = (request, response, next) ->
    user = request.user

    if user?
      json = user.toJSON()
      json.meta ?= {}

      # Get rid of sensitive fields
      delete json.meta.activationToken
      delete json.password

      response.json json
    else response.json {}


exports["@singleton"] = true
