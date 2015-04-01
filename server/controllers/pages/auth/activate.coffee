validator = require 'validator'

# Controller for the guest page. Prompts to create a guest user, if so then
# create one and redirect to the guest posting page.
controller = module.exports =
  get: (request, response, next) ->
    failUrl = '/auth/login?error=activate_fail'
    successUrl = '/auth/login?success=activate_success'

    # Get the parameters
    token = request.query.token
    id = request.params.id

    # Clean out the parameters
    if token.length != 24 or not validator.isMongoId id then return next()

    # Try and activate the user
    user = global.models.user
    user.activate id, token, (error, success) ->
      if error then return response.redirect(failUrl)
      if success then return response.redirect(successUrl)

      # Show 404 if activation failed
      next()