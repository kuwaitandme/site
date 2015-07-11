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
    $scope.$emit "page-loaded", title: classified.title

    # Set the query params for the similar classifieds..
    $scope.similarListOptions.query =
      # Don't include the childcategory for the timebeing..
      # child_category: classified.child_category
      exclude: classified.id
      parent_category: classified.parent_category
      status: Classifieds.statuses.ACTIVE

    # Set the query for the user's posted classifieds.
    $scope.userListOptions.query =
      exclude: classified.id
      owner: classified.owner
      status: Classifieds.statuses.ACTIVE

    # Finally attach the classified in the DOM.
    $scope.classified = classified


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "models.classifieds"
]
