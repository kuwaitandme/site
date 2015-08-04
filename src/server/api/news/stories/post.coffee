exports = module.exports = (Stories, NeedAuthError) ->
  controller = (request, response, next) ->
    if not request.isAuthenticated() then return next new NeedAuthError

    request.body.created_by = request.user.id
    Stories.create request.body
    .then (story) -> response.json story
    .catch (e) -> next e


exports["@require"] = [
  "models/news/stories"
  "errors/NeedAuthenticationError"
]
exports["@singleton"] = true
