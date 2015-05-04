validator = require "validator"

# singleController = require "../../controllers/classified/single"

exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    response.contentType "application/json"
    slug = request.params.slug

    Classifieds.getBySlug slug, (error, classified) ->
      response.end JSON.stringify classified, null, 2

exports["@require"] = ["models/classifieds"]
exports["@singleton"] = true