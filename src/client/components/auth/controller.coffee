exports = module.exports = ($element, $scope, $location, $log, $timeout) ->
  @name = "[component:auth]"
  $log.log @name, "initializing"

  $scope.close = ->
    $element.removeClass "fade"
    $timeout (-> $element.removeClass "show"), 500
  $scope.open = ->
    $element.addClass "show"
    $timeout (-> $element.addClass "fade"), 100


exports.$inject = [
  "$element"
  "$scope"
  "$location"
  "$log"
  "$timeout"
]
