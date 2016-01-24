###
@api {get} /users/:id Get a single user
@apiName GetUser
@apiGroup User

@apiParam {Number} id Users unique ID.

@apiSuccess {String} firstname Firstname of the User.
@apiSuccess {String} lastname  Lastname of the User.
@apiVersion 1.0.0
###
Controller = module.exports = (User) ->
  (request, response, next) ->
    User.forge id: request.params.id
    .fetch().then (user) -> response.json user
    .catch (e) -> next e


Controller["@require"] = ["models/user"]
Controller["@routes"] = ["/users/:id"]
Controller["@singleton"] = true