###
@api {get} /users/:username Get a single user
@apiName GetUserUsername
@apiGroup User

@apiParam {String} username Users unique username.

@apiSuccess {String} firstname Firstname of the User.
@apiSuccess {String} lastname  Lastname of the User.
@apiVersion 1.0.0
###
Controller = module.exports = (User) ->
  (request, response, next) ->
    User.forge username: request.params.slug
    .fetch().then (user) -> response.json user
    .catch (e) -> next e


Controller["@require"] = ["models/user"]
Controller["@routes"] = ["/users/username/:slug"]
Controller["@singleton"] = true