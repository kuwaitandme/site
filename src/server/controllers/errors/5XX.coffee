exports = module.exports = (renderer, settings) ->
  controller = (error, request, response, next) ->
    response.status error.status or 500

    # In production, no stack-traces leaked to user
    if settings.server.env is "production" then error.stack = null

    # For API request just return a JSON version of the message
    if request.url.indexOf("/api") > -1 then return response.json error.message

    # Render 404 errors separately.
    template = if error.status is 404 then "404" else "error"


    options =
      page: "errors/5XX"
      title: "Something freaky happened!"
      data:
        error: error
        message: error.message
        status: error.status or 500
    renderer request, response, options


exports["@require"] = [
  "libraries/renderer"
  "igloo/settings"
]
exports["@singleton"] = true
