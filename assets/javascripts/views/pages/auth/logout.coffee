module.exports = Backbone.View.extend
  name: "[view:auth-logout]"

  # Let the app know that we want to redirect to the login page
  checkRedirect: ->
    @resources.currentUser.logout()
    true


  redirectUrl: -> "#{@resources.language.urlSlug}/auth/login?success=logout"