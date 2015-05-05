exports = module.exports = ($rootScope) ->
  body = document.body
  $rootScope.$on "$stateChangeStart",
    (event, toState, toParams, fromState, fromParams) ->
      console.log "[router] switching from '#{fromState.name}' to '#{toState.name}'"
      if toState.templateUrl?
        bodyid = toState.templateUrl.replace "/", "-"
        body.id = bodyid

  # $rootScope.$on "$viewContentLoaded",
  #   (event, toState, toParams, fromState, fromParams) ->
  #     setTimeout (-> document.body.scrollTop=0), 250

exports.$inject = ["$rootScope"]