validator = require "validator"
url = require "url"
querystring = require "querystring"

###*
 * This controller takes in a classified id, queries the database and redirects
 * the user to the site with the classified slug in place. This redirector
 * is useful for shortening links down in size and can be used especially
 * in posts, articles etc.. to give a clean/simple look.
 *
 * @param   Number id     ID of the classified which we must redirect to
 * @return  HTTP:301      URL of the classified's actual url to which we must
 *                        redirect to
 *          HTTP:404      if the id does not match to any classified in the DB.
 *
 * @example GET sitename.tld/c/123 -> 301 sitename.tld/classified-slug-here-123
###
exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    if request.params.length == 0 then return next()

    # Get the id of the classified and validate it
    id = request.params[0]
    if not validator.isInt id, {min: 0} then return next()

    # Reconstruct the query string, because when we redirect, we lose
    # the query string in the original redirect URL.
    query = (url.parse request.url, true).query or {}
    try newqueryString = querystring.stringify query
    catch e then newqueryString = ""

    # Finally query the DB and redirect
    Classifieds.get id
    .then (classified) ->
      if not classified then return next()
      response.redirect "/#{classified.toJSON().slug}?#{newqueryString}"
    .catch next


exports["@require"] = ["models/classifieds"]
exports["@singleton"] = true
