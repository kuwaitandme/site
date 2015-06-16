exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    # if not request.isAuthenticated()
    #   return response.redirect "/auth?_error=need_login"

    options =
      bodyid: "classified-edit"
      data: guest: true
      description: null
      page: "classified/edit"
      title: response.__ "title.classified.edit"
    renderer request, response, options, false


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true
