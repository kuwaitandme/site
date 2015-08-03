exports = module.exports = ($scope, $element, $imageResizer, $log, $timeout) ->

  $scope.$watch "value", (value="") ->
    # Remove multiple spaces.
    value = value.replace /\s+(?= )/g, ''

    # Remove leading spaces.
    value = value.replace /^\s/g, ''

    # Remove unwanted characters
    value = value.replace /[.;,?\n\'\"]/g, ''

    # Finally grab all the keywords from the clean value
    $scope.keywords = value.split /[\s]+/
    $scope.keywords.pop()

    # Reset the dirty value with the cleaned one.
    $scope.value = value


  # Every time a word is clicked, we automatically remove it.
  $scope.removeWord = (word) -> $scope.value = $scope.value.replace word, ""


exports.$inject = [
  "$scope"
  "$element"
  "$imageResizer"
  "$log"
  "$timeout"
]
