exports = module.exports = ($rootScope) ->
  $rootScope.$on "$stateChangeStart",
    (event, toState, toParams, fromState, fromParams) ->
      if toState.templateUrl?
        bodyid = toState.templateUrl.replace "/", "-"
        body = document.getElementsByTagName "body"
        body[0].id = bodyid

exports.$inject = ["$rootScope"]