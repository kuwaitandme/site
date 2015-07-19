exports = module.exports = (Logs) ->
  (request, response, next) ->
    Logs.log request, "logout"
    # request.session.destroy()
    response.json {}


exports["@require"] = ["models/logs"]
exports["@singleton"] = true
