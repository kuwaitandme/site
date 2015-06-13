exports = module.exports = ($scope, Categories) ->
  $scope.cats = Categories.getAll()

  # Initialize this so that the $watch in the link function can bind to it.
  $scope.childCategory = null
  $scope.parentCategory = null

  $scope.setParent = (cat={}) ->
    $scope.parentCategory = cat
    if not cat.children? then $scope.opened = false
  $scope.setChild = (cat={}) ->
    $scope.childCategory = cat
    $scope.opened = false

  $scope.$watch "parent_category", (id) ->
    $scope.setParent Categories.findByParentId id
  $scope.$watch "child_category", (id) ->
    $scope.setChild Categories.findByChildId id

exports.$inject = [
  "$scope"
  "models.categories"
]
