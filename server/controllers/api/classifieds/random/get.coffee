validator = require "validator"


exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    Classifieds.getRandom (error, classified) -> response.json classified


exports["@require"] = ["models/classifieds"]
exports["@singleton"] = true