exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    options =
      data: guest: true
      description: null
      page: "classified/post"
      title: response.__ "title.guest.post"
    renderer request, response, options, false


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true