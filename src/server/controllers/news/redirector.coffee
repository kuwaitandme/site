querystring = require "querystring"
url = require "url"
validator = require "validator"


###
  This controller takes in a story id, queries the database and redirects
  the user to the site with the story slug in place. This redirector
  is useful for shortening links down in size and can be used especially
  in posts, articles etc.. to give a clean/simple look.

  @param {Number} id      ID of the story which we must redirect to
  @return {HTTP:301}      URL of the story's actual url to which we must
                          redirect to
          {HTTP:404}      if the id does not match to any story in the DB.

  @example
  GET sitename.tld/c/123 -> 301 sitename.tld/story-slug-here-123
###
exports = module.exports = (Stories, NotFoundError) ->
  controller = (request, response, next) ->
    if request.params.length is 0 then return next()

    # Get the id of the classified and validate it
    id = request.params[0]
    if not validator.isInt id, {min: 0} then return next()

    # Reconstruct the query string, because when we redirect, we lose
    # the query string in the original redirect URL.
    query = url.parse(request.url, true).query or {}
    try newqueryString = querystring.stringify query
    catch e then newqueryString = ""

    # Finally query the DB and redirect
    Stories.get id
    .then (story) ->
      if not story then throw new NotFoundError
      response.redirect "/news/story/#{story.get "slug"}?#{newqueryString}"
    .catch (e) -> next e


exports["@require"] = [
  "models/news/stories"
  "errors/NotFoundError"
]
exports["@singleton"] = true
