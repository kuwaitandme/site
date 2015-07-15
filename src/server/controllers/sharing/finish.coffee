exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    # Prepare the data for the renderer
    options =
      cache:
        key: "route:/classified/finish"
      bodyid: "classified-finish"
      page: "classified/finish"
      title: response.__ "title.classified.finish"

    # Now render the page..
    renderer request, response, options
    # Pass any errors to the handlers
    .catch next


exports["@require"] = ["libraries/renderer"]
exports["@singleton"] = true
