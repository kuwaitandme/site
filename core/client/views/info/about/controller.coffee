module.exports = Controller = ($scope, $log) ->
  logger = $log.init Controller.tag
  logger.log "initializing"
  $scope.$emit "page:initialize"
  $scope.$emit "page:start"


Controller.tag = "page:info/about"
Controller.$inject = [
  "$scope"
  "$log"
]