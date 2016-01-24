###
  @apiDefine EnsureLoggedIn

  @apiHeader {String} Cookie cookie data containing the user's session
  @apiErrorExample {json} Authentication error
    HTTP/1.1 401 Unauthenticated
    {
      "error": "NeedAuthentication"
    }
###
Middleware = module.exports = (NeedAuthenticationError) ->
  (request, response, next) ->
    if request.isAuthenticated() then next()
    else next new NeedAuthenticationError()


Middleware["@singleton"] = true
Middleware["@require"] = ["libraries/errors/NeedAuthenticationError"]