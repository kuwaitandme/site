exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    options =
      page: "auth/signup"
      title: response.__ "title.auth.signup"

    renderer request, response, options, true


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true