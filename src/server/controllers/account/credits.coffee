exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect "/?_error=need_login"

    options =
      page: "account/credits"
      title: response.__ "title.account.credits"
    renderer request, response, options, true


exports["@require"] = ["libraries/renderer"]
exports["@singleton"] = true
