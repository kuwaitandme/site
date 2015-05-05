exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    # if not request.isAuthenticated() then return response.redirect "/auth/login?error=need_login"
    options =
      bodyid: "classified-post"
      data: guest: true
      description: null
      page: "classified/post"
      title: response.__ "title.classified.post"
    renderer request, response, options, false


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true