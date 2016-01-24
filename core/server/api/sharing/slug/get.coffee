exports = module.exports = (Items, NotFoundError) ->
  controller = (request, response, next) ->
    Promise.resolve request.params[0]
    .then (slug) ->
      if not slug? or slug is "undefined" then throw new NotFoundError
      Items.getBySlug slug
    .then (item) ->
      if item? then throw new NotFoundError
      response.json item
    .catch(e) -> next e


exports.APIroute = "/sharing/item/slug/([^/]+)"
exports["@require"] = [
  "models/sharing/items"
  "libraries/errors/NotFoundError"
]
exports["@singleton"] = true