name = "[page:classified-single]"


exports = module.exports = ($scope, $root, $stateParams, $log, Classifieds) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams

  $scope.userListOptions =
    options:
      loadSinglePage: true
      hideFinishMessage: true
      emptyMessage: "This user has only one classified"

  $scope.similarListOptions =
    options:
      maxClassifieds: 10
      loadSinglePage: true
      hideFinishMessage: true
      emptyMessage: "There are no similar classifieds"


  # Load the classified!
  Classifieds.get($stateParams.id).then (classified) ->
    $scope.$emit "page-loaded"

    query =
      child_category: classified.child_category
      parent_category: classified.parent_category
      status: Classifieds.statuses.ACTIVE
      exclude: classified.id

    $scope.similarListOptions.query = query

    $scope.userListOptions.query = query
    $scope.userListOptions.query.owner = classified.owner

    $scope.classified = classified


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "models.classifieds"
]
