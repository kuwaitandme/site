Promise = require "bluebird"
validator = require "validator"


exports = module.exports = (Users) ->
  controller = (request, response, next) ->
    Users.query().then (users) ->
      users = users.toJSON()
      for user in users
        delete user.password
        delete user.credits
        delete user.login_providers
        delete user.meta
      response.json users

    # For any error (including any 500 errors) return a 404 page.
    .catch ->
      response.status 404
      response.json "user not found"


exports["@require"] = ["models/users"]
exports["@singleton"] = true
