exports = module.exports = (Notifications) ->
  controller = (request, response, next) ->
    if not request.isAuthenticated() then return response.json []

    Notifications.query request.query
    .then (results) -> response.json results


exports["@require"] = ["models/notifications"]
exports["@singleton"] = true
