# Controller for the Signup page. Attempts to register the user in.
#
# If registration was successful, redirect to the classified posting page so
# that the user can start posting his/her classified.
controller = module.exports =
  get: (request, response, next) ->
    args =
      page: 'auth/signup'
      title: response.__('title.auth.signup')

    render = global.modules.renderer
    render request, response, args, true