exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    options =
      bodyid: "classified-post"
      data: guest: true
      description: null
      page: "classified/post"
      title: response.__ "auth/signup:title"
    renderer request, response, options, false


exports["@require"] = ["libraries/renderer"]
exports["@singleton"] = true
