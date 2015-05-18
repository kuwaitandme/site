exports = module.exports = (renderer, settings) ->
  controller = (error, request, response, next) ->

    # In production, no stack-traces leaked to user
    if settings.server.env is "production" then error.stack = null
    # Render 404 errors separately.
    template = if error.status is 404 then "404" else "error"

    args =
      page: "errors/5XX"
      title: "Something freaky happened!"
      data:
        error: error
        message: error.message
        status: error.status or 500
    response.status error.status or 500
    renderer request, response, args, true


exports["@require"] = [
  "controllers/renderer"
  "igloo/settings"
]
exports["@singleton"] = true