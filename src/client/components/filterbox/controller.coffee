name = "[component:filterbox]"

exports = module.exports = ($scope, $log, modal) ->
  $log.log name, "initializing"

  $scope.showModal = ->
    modal.showModal
      controller: require "./controller-modal"
      templateUrl: "components/filterbox/template-modal"
  $scope.showModal()


exports.$inject = [
  "$scope"
  "$log"
  "modal"
]
