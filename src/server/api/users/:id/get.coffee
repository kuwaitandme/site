Promise = require "bluebird"
validator = require "validator"


exports = module.exports = (Users) ->
  controller = (request, response, next) ->
    Users.query().then (users) ->
      for user in users
        delete user.password
        delete user.credits
      response.json users

  # ascontroller = (request, response, next) ->
  #   Promise.resolve request.params[0]
  #   # First validate the id, see if it's clean.
  #   .then (id) ->
  #     # If it wasn't then throw an error which will return a 404
  #     if not id? and not validator.isInt id, {max: 2147483647, min: 0}
  #       throw Error

  #     # All good, so now query the DB
  #     Users.get id
  #   .then (user) ->
  #     if not user then throw Error

  #     # Convert the user to JSON so that we can start removing sensitive
  #     # fields.
  #     #
  #     # TODO use custom column select with the query...
  #     user = user.toJSON()
  #     delete user.password
  #     delete user.credits
  #     delete user.role
  #     delete user.login_providers
  #     delete user.meta
  #     response.json user

  #   # For any error (including any 500 errors) return a 404 page.
  #   .catch ->
  #     response.status 404
  #     response.json "user not found"


exports["@require"] = ["models/users"]
exports["@singleton"] = true
