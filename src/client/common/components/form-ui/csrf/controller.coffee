exports = module.exports = ($scope, $csrf) ->
  $csrf.getToken().success (token) -> $scope.token = token


exports.$inject = [
  "$scope"
  "$csrf"
]
