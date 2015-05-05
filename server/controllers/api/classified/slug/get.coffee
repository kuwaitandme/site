validator = require "validator"

# singleController = require "../../controllers/classified/single"

exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    slug = request.params.slug

    if not slug? or slug is "undefined"
      response.status 404
      response.json {}
    else
      Classifieds.getBySlug slug, (error, classified) ->
        response.json classified


exports["@require"] = ["models/classifieds"]
exports["@singleton"] = true