exports = module.exports = (Notifications) ->
  controller = (request, response, next) ->
    Notifications.query request.query
    .then (results) -> response.json results


exports["@require"] = ["models/notifications"]
exports["@singleton"] = true
