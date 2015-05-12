exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    options =
      page: "auth/login"
      title: "Login/Signup"

    renderer request, response, options, true


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true