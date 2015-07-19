# Controller for the logout page. If accessed, it immediately logs out the
# currently logged in user and redirects to the homepage.
exports = module.exports = (Events) ->
  controller = (request, response, next) ->
    Events.log request, "LOGOUT"
    request.session.destroy()
    response.redirect "/?success=logout"

exports["@require"] = ["models/logs"]
exports["@singleton"] = true
