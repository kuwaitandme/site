exports = module.exports = (Events) ->
  (request, response, next) ->
    Events.log request, "LOGOUT"
    request.session.destroy()
    response.json {}


exports["@require"] = ["models/events"]
exports["@singleton"] = true
