exports = module.exports = (Notifications) ->
  controller = (request, response, next) ->
    if not request.isAuthenticated()
      request.status 401
      return response.json {}

    Notifications.patch request.user.id, hasRead: 1
    .then (results) -> response.json results


exports["@require"] = ["models/notifications"]
exports["@singleton"] = true
