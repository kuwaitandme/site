name = "[component:auth]"

exports = module.exports = ($scope, $log, $root, Modal) ->
  $log.log name, "initializing"

  $scope.open = ->
    $root.bodyClasses["show-auth-modal"] = true
    $scope.tab = "main"
    console.trace "showing"
    AuthModal = Modal.showModal
      controller: require "./controller-modal"
      templateUrl: "components/auth/template"
    .then (modal) ->
      modal.close.then -> $root.bodyClasses["show-auth-modal"] = false
      modal


  $scope.$on "component:auth:show", ->
    console.log name, "got"
    $scope.open().then (modal) -> modal.scope.goto "main"

  $scope.$on "component:auth:show-signup", (event, data) ->
    $scope.open()
    .then (modal) ->
      modal.scope.goto "signup"
      angular.extend modal.scope.signup, data


exports.$inject = [
  "$scope"
  "$log"
  "$rootScope"
  "modal"
]
