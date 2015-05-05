module.exports = (classified, request, response, next) ->
  newStatus = request.body.status
  moderatorReason = request.body.moderatorReason

  user = request.user or {}
  isModerator = user.isModerator
  isOwner = (user._id is classified.owner)

  Classified = global.models.classified
  status = Classified.status
  id = classified._id

  # Check if the user has the privileges to change to the given status
  if not isModerator
    if classified.guest
      if newStatus in [status.ACTIVE, status.REJECTED, status.BANNED]
        response.status 401
        return response.json "only a moderator can set that status"
    else
      if newStatus in [status.REJECTED, status.BANNED, status.INACTIVE]
        response.status 401
        return response.json "only a moderator can set that status"
  else
    if newStatus is status.ARCHIVED
      response.status 401
      return response.json "moderators should not archive a classified"

  # The callback function that gets called after the status of the classified
  # has been changed.
  callback = (error, result) ->
    if error
      if error.status
        response.status error.status
        return response.json error.message
      else next error

    response.json result

  # Finally, switch on the status and perform the necessary action.
  switch newStatus
    when status.ACTIVE
      if isModerator then status.publish id, callback
      else status.repost id, callback
    when status.ARCHIVED then status.archive id, callback
    when status.BANNED then status.ban id, moderatorReason, callback
    when status.INACTIVE then status.inactive id, callback
    when status.REJECTED then  status.reject id, moderatorReason, callback

    # The last condition, again, you should not reach here because of all
    # the previous checks
    else
      error = new Error "invalid status/reason"
      error.status = 400
      callback error, null


# This function attempts to validate the classified status and returns true
# iff the fields are valid.
isValidStatus = (status, moderatorReason) ->
  Classified = global.models.classified
  statuses = Classified.status

  if status? and validator.isInt status and
  Number status in [statuses.ACTIVE, statuses.ARCHIVED, statuses.BANNED,
    statuses.INACTIVE, statuses.REJECTED]
    return true
  false

# TODO implement this soon
isValidReport = -> true
isValidPerk = -> true