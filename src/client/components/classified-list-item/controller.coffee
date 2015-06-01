exports = module.exports = ($location, $log, $root, $scope, $timeout, $window,
Classifieds) ->
  @name = "[component:classified-list]"
  $log.log @name, "initializing"

  $scope.queryFinished ?= false
  $scope.redirectToEditPage ?= false

  # This function toggles the classified dropdown
  $scope.toggleClassified = (classified) ->
    # _animateIn = ()
    if $scope.redirectToEditPage
      return $location.path "/classified/edit/#{classified.id}"

    if not $scope.showClassifiedContainer
      $scope.$broadcast "classified-changed", classified
      $root.bodyStyles.overflowY = "hidden"
      scrollPosition = body.scrollTop
      body.scrollTop = 0

      $scope.classified = classified
      $scope.showClassifiedContainer = true

      $scope.classifiedStyles =
        animateBackground: true
        enterAnimation: true
      $timeout  ->
        $scope.classifiedStyles.animateClassified = true
      , 200
    else
      $scope.classifiedStyles = {}
      $scope.classifiedStyles.leaveAnimation = true
      $scope.classifiedStyles.animateClassified = true

      $timeout  ->
        $scope.classifiedStyles.animateBackground = true
        $timeout  ->
          $scope.classifiedStyles.animationDone = true
          $scope.showClassifiedContainer = false
        , 500
      , 200
      $timeout (-> body.scrollTop = scrollPosition), 50
      $root.bodyStyles.overflowY = ""


exports.$inject = [
  "$location"
  "$log"
  "$rootScope"
  "$scope"
  "$timeout"
  "$window"

  "models.classifieds"
]
