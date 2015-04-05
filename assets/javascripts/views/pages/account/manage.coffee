module.exports = (require '../../mainView').extend
  name: '[view:account-manage]'
  template: template['account/manage']

  checkRedirect: -> @resources.currentUser.isAnonymous()
  redirectUrl: -> '/auth/login?error=need_login'

  start: ->
    @$classifiedList = @$ ".classifiedList"

    @classifiedList = new @resources.Views.components.classifiedList
      settings:
        isAccount: true
        enableFilterBox: false
      resources: @resources
      el: @$classifiedList