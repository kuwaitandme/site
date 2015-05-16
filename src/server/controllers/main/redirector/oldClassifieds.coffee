validator = require "validator"
url = require "url"
querystring = require "querystring"


map =
  "5553af99918733ea68a5a088" : 393


exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    if request.params.length == 0 then return next()

    newId = map[request.params[0]]
    if not newId? then return next()

    # Reconstruct the query string
    query = (url.parse request.url, true).query or {}
    try newqueryString = querystring.stringify query
    catch e then newqueryString = ""

    # Redirect to the new URL
    response.redirect "/c/#{newId}?#{newqueryString}"

exports["@singleton"] = true