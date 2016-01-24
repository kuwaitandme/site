# Controller for the logout page. If accessed, it immediately logs out the
# currently logged in user and redirects to the homepage.
Controller = module.exports = ->
  routes: ["/logout"]
  controller: (request, response, next) ->
    request.session.destroy()
    response.redirect "/?_success=logout"


Controller["@singleton"] = true