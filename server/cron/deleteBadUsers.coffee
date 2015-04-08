module.exports = ->
  User = global.models.user

  # Remove Users inactive for 7 days
  date = new Date()
  date.setDate date.getDate() - 7
  query =
    $and: [
      { status: User.status.INACTIVE }
      { created: $lt: date }
    ]
  User.model.find query, (error, users) ->
    for user in users
      user.remove()