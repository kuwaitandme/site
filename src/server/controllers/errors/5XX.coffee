exports = module.exports = (renderer, settings) ->
  controller = (error, request, response, next) ->
    response.status error.status or 500

    isProduction = settings.server.env == "production"

    # In production, no stack-traces leaked to user
    if isProduction then error.stack = null
    # In development, display the error on console
    else console.error error.trace

    # For API request just return a JSON version of the message
    if request.url.indexOf("/api") > -1 then return response.json error.message

    # Handle 404 errors separately.
    template = if error.status is 404 then next() #"404" else "error"

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
