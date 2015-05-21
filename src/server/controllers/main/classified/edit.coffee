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

# validator = require "validator"

# controller = module.exports =
#   get: (request, response, next) ->
#     # Check if the user is loggedin or not
#     if not request.isAuthenticated()
#       return response.redirect "/auth/login?error=need_login"

#     # Get and validate the id
#     id = request.params[0]
#     if not validator.isMongoId id then return next()

#     # Get the classified
#     classified = global.models.classified
#     classified.get id, (error, classified) ->
#       if error then return next error

#       # Display 404 page if classified is not found
#       if not classified then return next()

#       render = global.modules.renderer
#       render request, response,
#         data: classified: classified
#         description: classified.description
#         page: "classified/edit"
#         title: response.__ "title.classified.edit"