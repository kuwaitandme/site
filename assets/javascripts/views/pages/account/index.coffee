module.exports = Backbone.View.extend
  name: '[view:account-index]'
  template: template['account/index']
  title: -> "Manage your account"

  checkRedirect: -> @resources.currentUser.isAnonymous()
  redirectUrl: -> '/auth/login?error=need_login'