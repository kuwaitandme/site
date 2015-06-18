validator = require "validator"

# singleController = require "../../controllers/classified/single"

exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    slug = request.params[0]

    if not slug? or slug is "undefined"
      response.status 404
      response.json {}
    else
      Classifieds.getBySlug slug
      .then (classified) -> response.json classified
      .catch ->
        response.status 400
        response.json {}


exports["@require"] = ["models/classifieds"]
exports["@singleton"] = true
