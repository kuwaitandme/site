exports = module.exports = ($scope, $location, $http, user) ->
  @name = "[page:auth-signup]"
  console.log @name, "initializing"


exports.$inject = [
  "$scope"
  "$location"
  "$http"
  "model.user"
]