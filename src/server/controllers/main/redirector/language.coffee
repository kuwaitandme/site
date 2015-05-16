validator = require "validator"
url = require "url"
querystring = require "querystring"


exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    if request.params.length == 0 then return next()

    # First clean out the sub-path
    pathname = request.params[1] or ""

    # Add the _lang to the exisiting query string
    query = (url.parse request.url, true).query or {}
    query._lang = request.params[0]
    try newqueryString = querystring.stringify query
    catch e then newqueryString = ""
    console.log newqueryString

    # Redirect to the new URL
    response.redirect "/#{pathname}?#{newqueryString}"

exports["@singleton"] = true