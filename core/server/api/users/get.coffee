Controller = module.exports = (User) ->
  (request, response, next) ->
    User.query().then (users) -> response.json users
    .catch (e) -> next e


Controller["@routes"] = ["/users"]
Controller["@require"] = ["models/user"]
Controller["@singleton"] = true