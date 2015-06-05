exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect "/auth?_error=need_login"

    options =
      page: "account/classifieds"
      title: response.__ "title.account.classifieds"
    renderer request, response, options, true


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true
