Controller = module.exports = (NotFoundError) ->
  (request, response, next) -> next new NotFoundError


Controller["@require"] = ["libraries/errors/NotFoundError"]
Controller["@singleton"] = true