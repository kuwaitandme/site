exports = module.exports = (Notifications) ->
  controller = (request, response, next) ->

    # If the user is user is not authenticated, then he really should not be
    # sending the request. (The client-side code should have already taken care
    # of no logins...). But whatever, return 401.
    if not request.isAuthenticated()
      request.status 401
      return response.json []

    # Mark all the notifications for this user as read.
    Notifications.patch request.user.id, hasRead: 1
    .then (results) -> response.json results

    # Error handler
    .catch next

exports["@require"] = ["models/notifications"]
exports["@singleton"] = true
