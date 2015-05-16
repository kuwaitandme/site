module.exports = ->
  # User = global.models.user

  # # Remove Users inactive for the past 3 days
  # date = new Date()
  # date.setDate date.getDate() - 3
  # query =
  #   $and: [
  #     { status: User.status.INACTIVE }
  #     { created: $lt: date }
  #   ]
  # User.model.find query, (error, users) ->
  #   for user in users
  #     user.remove()