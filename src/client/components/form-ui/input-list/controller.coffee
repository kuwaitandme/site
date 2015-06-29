exports = module.exports = ($scope) ->
  $scope.setItem = (item) ->
    console.log 'settem', item
    $scope.userInput = item.name
    $scope.targetItem = item.id
    $scope.focused = false

  $scope.$watch "userInput", (value="", previous) ->
    $scope.targetItem = null

    for item in ($scope.list or [])
      if item.name.toLowerCase() is value.toLowerCase()
        $scope.targetItem = item.id

    # If a previous value was set and the targetItem has not been found, then
    # that means that the user is interacting with the element. So we force the
    # list to popup..
    if previous? and not $scope.targetItem? then $scope.focused = true

exports.$inject = ["$scope"]
