exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect "/?_error=need_login"

    options =
      page: "account/index"
      title: response.__ "title.account"
    renderer request, response, options, true


exports["@require"] = ["libraries/renderer"]
exports["@singleton"] = true