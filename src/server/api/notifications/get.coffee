exports = module.exports = (Notifications) ->
  controller = (request, response, next) ->
    # Check for authentication, if the user is authenticated, then add the user
    # id into the query. Else return an empty array.
    if not request.isAuthenticated() then return response.json []
    request.query.user = request.user.id

    # Fetch all notifications for the given user
    Notifications.query request.query
    .then (results) -> response.json results

    # Error handler
    .catch next

exports["@require"] = ["models/notifications"]
exports["@singleton"] = true
