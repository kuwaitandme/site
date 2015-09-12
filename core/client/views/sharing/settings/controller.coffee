Controller = ($log, $scope, Users, Settings) ->
  logger = $log.init Controller.tag
  logger.log "initializing"
  $scope.$emit "page:initialize"
  $scope.$emit "page:start"

  $scope.sampleStory = require "./sampleStory.json"

  onSettingsUpdate = (value) -> Settings.setAll value
  $scope.$watch "settings", onSettingsUpdate, true

  onSettingsChange = -> $scope.settings = Settings.getAll()
  $scope.$on "settings:change", onSettingsChange, true
  onSettingsChange()


Controller.tag = "page:sharing/settings"
Controller.$inject = [
  "$log"
  "$scope"
  "@models/users"
  "@settings"
]
module.exports = Controller