Promise   = require "bluebird"
passport  = require "passport"
validator = require "validator"


###
  @api {post} /api/session/email/signup Signup with email
  @apiName SignupLogin
  @apiGroup Authentication
  @apiVersion 1.0.0

  @apiDescription Signup a user using email. The email is not verified (for now)

  @apiParam {String} email The email of the user.
  @apiParam {String} username The username used for login.
  @apiParam {String} password The password for the account.

  @apiSuccessExample {json} Success-Response:
  HTTP/1.1 200 OK
  {
    "id": 7
    "email": "jon@mail.com",
    "language": 1,
    "login_providers": {
      "email": "jon@mail.com"
    },
    "role": 1,
    "slug": "johnny",
    "status": 1,
    "username": "johnny",
    "updated_at": "2015-09-27T08:53:07.202Z",
    "created_at": "2015-09-27T08:53:07.202Z",
  }

  @apiUse CheckCaptcha
###
Controller = module.exports = (IoC, Users) ->
  logger = IoC.create "igloo/logger"

  validateRequest = (request) ->
    email = request.body.email
    username = request.body.username
    password = request.body.password

    # Check for any missing fields
    if not password or not email or not username
      throw new Error "missing fields"

    # Check for a short password
    if password.length < 6 then throw new Error "short password"

    # Check for invalid characters
    if not (validator.isEmail email) or
    not (validator.matches username, /[a-zA-Z0-9_]+/)
      throw new Error "bad email/name"

    request


  createNewUserObject = (request) ->
    email: request.body.email
    language: 1 # hard code for now
    login_providers: email: request.body.email
    mailing_list_token: Users.hashPassword Users.randomPassword()
    # meta: activationToken: Users.hashPassword Users.randomPassword()
    password: Users.hashPassword request.body.password
    role: Users.roles["Normal"]
    rss_token: Users.hashPassword Users.randomPassword()
    slug: request.body.username
    # status: Users.statuses["In-Active"]
    status: Users.statuses["Active"]
    username: request.body.username



  (request, response, next) ->
    Promise.resolve request
    .then validateRequest
    .then createNewUserObject
    .then (newUser) -> Users.create newUser

    .then (model) ->
      request.logIn model, (error) ->
        if error then throw error
        response.json model

    .catch (error) ->
      logger.error    error.stack
      response.status error.status or 400
      response.json   error.message


Controller["@middlewares"] = ["CheckCaptcha"]
Controller["@require"] = [
  "$container"
  "models/users"
]
Controller["@singleton"] = true
Controller["@routes"] = ["/session/email/signup"]