passport = require "passport"


###
  This is a controller for the login via Email. It makes sure that that the
  user logs in properly when the correct credentials are given and creates a
  login event.

  On successful login, the controller returns a JSON of the logged in user and
  sets the session cookie.

  @param  String username         The username (email) of the user
  @param  String password         The password of the user
  @required username, password

  @example
  POST sitename.tld/api/auth/email/login {..} -> 200 JSON { user }
  POST sitename.tld/api/auth/email/login {..} -> 400 JSON "error message"

  @author Steven Enamakel <me@steven.pw>
###
exports = module.exports = (Events) ->
  routes: ["/auth/email/login"]

  controller: (request, response, next) ->
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
    (passport.authenticate "local", finish) request, response, next


exports["@require"] = ["models/logs"]
exports["@singleton"] = true