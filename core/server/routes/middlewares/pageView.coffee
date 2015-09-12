exports = module.exports = (Users) ->
  middleware = (request, response, next) ->
    analytics.pageView request.ip

    if request.user
      user.updateLastOnlineTime request.user.uid

      if request.path.startsWith("/api/users") or
      request.path.startsWith("/users")
        user.updateOnlineUsers request.user.uid, next
      else
        user.updateOnlineUsers request.user.uid
        next()
    else next()


exports["@singleton"] = true
exports["@require"] = ["models/users"]