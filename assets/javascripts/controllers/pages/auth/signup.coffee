exports = module.exports = ($scope, $location, $http, user) ->
  @name = '[page:auth-signup]'
  console.log @name, 'initializing'

  body = document.getElementsByTagName "body"
  body[0].id = "auth-signup"


exports.$inject = [
  '$scope'
  '$location'
  '$http'
  'model.user'
]