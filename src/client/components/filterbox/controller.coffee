name = "[component:filterbox]"

exports = module.exports = ($document, $scope, $root, $log, setTimeout, modal, Locations) ->
  $log.log name, "initializing"

  console.log Locations.getAll()

  $scope.showModal = ->
    $log.log name, "opening modal"
    console.log modal
    $log.log modal.showModal
      templateUrl: "components/filterbox/template-modal"
      controller: ($scope) ->
        $scope.ctrl = {}
        $scope.locations = Locations.getAll()
        console.log "i'm in modal"

exports.$inject = [
  "$document"
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
  "modal"
  "models.locations"
]
