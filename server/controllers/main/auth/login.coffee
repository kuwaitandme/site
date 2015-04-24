# Controller for the login page. Attempts to log the user in.
#
# If successful, redirect to the account page or else stay in the login page
# and display an error
controller = module.exports =
  get: (request, response, next) ->
    args =
      page: 'auth/login'
      title: response.__ 'title.auth.login'

    render = global.modules.renderer
    render request, response, args, true