exports = module.exports = ($root, $scope, $stateParams, $location,
$timeout, close, Locations, Categories) ->
  $scope.ctrl = {}
  $scope.locations = Locations.getAll()
  $scope.closeModel = -> close()

  # Set the category
  childCategory  = Categories.findBySlug($stateParams.child) or {}
  parentCategory = Categories.findBySlug($stateParams.parent) or {}
  $scope.ctrl.categories =
    child_category:  childCategory.id
    parent_category: parentCategory.id

  # Set the keywords
  $scope.ctrl.keywords = $location.search()["keywords"]

  # Set the location
  $scope.ctrl.location = $location.search()["location"]

  # Set the  price
  $scope.ctrl.price = $location.search()

  # And finally the sort options
  $scope.ctrl.sort = $location.search()["sort"]

  $scope.sorts = [
    { id: 1, name: "Latest First"}
    { id: 2, name: "Most expensive" }
    { id: 3, name: "Most cheapest"}
  ]


  $scope.submit = ->
    query = {}
    categories = $scope.ctrl.categories

    angular.extend(
      query
      $scope.ctrl.price
      {keywords: $scope.ctrl.keywords}
      {location: $scope.ctrl.location}
      {sort: $scope.ctrl.sort}
    )

    childCat = Categories.findByChildId categories.child_category
    parentCat = Categories.findByParentId categories.parent_category

    returnUrl = "/classified"
    if parentCat then returnUrl += "/#{parentCat.slug}"
    if childCat then returnUrl += "/#{childCat.slug}"



    # Redirect to the correct URL
    $location.path returnUrl
    $location.search query
    location.reload()

    # Close the modal
    close()


exports.$inject = [
  "$rootScope"
  "$scope"
  "$stateParams"
  "$location"
  "$timeout"
  "close"
  "models.locations"
  "models.categories"
]
