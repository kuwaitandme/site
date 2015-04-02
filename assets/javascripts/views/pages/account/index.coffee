module.exports = (require '../../mainView').extend
  name: '[view:account-index]'
  template: template['account/index']

  checkRedirect: -> @resources.currentUser.isAnonymous()
  redirectUrl: -> '/auth/login?error=need_login'