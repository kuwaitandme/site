Promise = require "bluebird"
validator = require "validator"


exports = module.exports = (Users) ->
  controller = (request, response, next) ->
    Users.findByUsernameOrEmail request.params[0]
    .then (user) ->
      if not user? then throw new Error

      user = user.toJSON()
      delete user.credits
      delete user.mailing_list_token
      delete user.password
      delete user.rss_token

      response.json user
    .catch ->
      response.status 404
      response.json {}

exports["@require"] = ["models/users"]
exports["@singleton"] = true
