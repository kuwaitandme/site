validator = require "validator"
url = require "url"
querystring = require "querystring"


exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    if request.params.length == 0 then return next()

    id = request.params[0]
    if not validator.isInt id, {min: 0} then return next()

    # Reconstruct the query string
    query = (url.parse request.url, true).query or {}
    try newqueryString = querystring.stringify query
    catch e then newqueryString = ""

    Classified.get id
    .then (classified) ->
      if not classified then return next()
      response.redirect "/#{classified.toJSON().slug}?#{newqueryString}"
    .catch next

exports["@require"] = ["models/classifieds"]
exports["@singleton"] = true
