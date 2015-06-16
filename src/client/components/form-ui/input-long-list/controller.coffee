exports = module.exports = ($scope) ->
  $scope.setItem = (item) ->
    $scope.userInput = item.name
    $scope.targetItem = item.id
    $scope.focused = false

  $scope.$watch "userInput", (value="") ->
    $scope.targetItem = null
    for item in $scope.list
      if item.name.toLowerCase() is value.toLowerCase()
        $scope.targetItem = item.id

exports = [
  "$scope"
]
