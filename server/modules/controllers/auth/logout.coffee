# Controller for the logout page. If accessed, it immediately logs out the
# currently logged in user and redirects to the homepage.
controller = module.exports =
  get: (request, response, next) ->
    request.session.destroy()
    response.redirect '/auth/login?success=logout'