module.exports = ($scope) ->

  $scope.$watch "userInput", (value="") ->
    for item in $scope.list
      if item.name.toLowerCase() is value.toLowerCase()
        $scope.targetItem = item.id
