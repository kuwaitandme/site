passport = require "passport"


###
  @api {post} /api/auth/email/login Login with email
  @apiName EmailLogin
  @apiGroup Authentication
  @apiVersion 1.0.0

  @apiDescription
  This is a controller for the login via Email. It makes sure that that the
  user logs in properly when the correct credentials are given and creates a
  login event.

  On successful login, the controller returns a JSON of the logged in user and
  sets the session cookie.

  There is no captcha here because we don't really care about bots scraping the
  site and brute-forcing the username and password will trigger the DDoS
  alarms.

  @apiParam {String} username         The username or email of the user
  @apiParam {String} password         The password of the user

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
###
Controller = module.exports = (Events) ->
  (request, response, next) ->
    finish = (error, user) ->
      if error or not user
        response.status 400
        return response.json error

      # Once the login was successful, manually log in the user and publish a
      # login event into the DB
      request.logIn user, (error) ->
        if error then return next error

        # Publish an event into the DB
        Events.log request, "LOGIN", provider: "email"

        # Get the user and hide the password field
        json = user.toJSON()
        delete json.password

        # Now return the modified user
        response.json json

    # Finally call the passport function for local authentication..
    passport.authenticate("local", finish) request, response, next


Controller["@require"] = ["models/logs"]
Controller["@routes"] = [
  "/session/email/login"
]
Controller["@singleton"] = true