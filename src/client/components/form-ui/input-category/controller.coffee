exports = module.exports = ($scope, Categories) ->
  $scope.categories = Categories.getAll()

  $scope.setParent = (cat) ->
    $scope.parent_category = cat
    if not cat.children? then $scope.opened = false
  $scope.setChild = (cat) ->
    $scope.child_category = cat
    if not cat.children? then $scope.opened = false
  # $scope.list = $scope.categories[0].children
exports.$inject = [
  "$scope"
  "models.categories"
]
