Middleware = module.exports = ->
  updateLastOnline = (user) ->
    meta = user.get("meta") or {}
    meta.lastOnline = new Date
    user.set "meta", meta
    user.save()

  (request, response, next) ->
    # If the user is logged in then set the last online date
    if not request.user? then return next()
    user = request.user

    # Get the date the user was last online
    meta = user.get("meta") or {}
    lastOnline = meta.lastOnline

    # Get a target date, so that we can prevent from always updating the last
    # online..
    targetDate = new Date()
    targetDate.setMinutes targetDate.getMinutes() - 1

    if lastOnline?
      # If it has been nearly an hour since the last online was updated, then
      if targetDate > new Date lastOnline then updateLastOnline user
    else updateLastOnline user


Middleware["@singleton"] = true