name = "[component:filterbox]"

exports = module.exports = ($document, $scope, $root, $log, setTimeout, modal, Locations) ->
  $log.log name, "initializing"

  $scope.showModal = ->
    $log.log name, "opening modal"
    modal.showModal
      templateUrl: "components/filterbox/template-modal"
      controller: ($scope) ->
        $scope.ctrl = {}
        $scope.locations = Locations.getAll()


exports.$inject = [
  "$document"
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
  "modal"
  "models.locations"
]
