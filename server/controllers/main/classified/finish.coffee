exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    # if not request.isAuthenticated() then return response.redirect "/auth/login?error=need_login"
    options =
      bodyid: "classified-finish"
      page: "classified/finish"
      title: response.__ "title.classified.finish"
    renderer request, response, options, false


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true