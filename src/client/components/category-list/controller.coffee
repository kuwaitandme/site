exports = module.exports = ($element, $scope, $location, console, Categories) ->
  @name = "[component:category-list]"
  console.log @name, "initializing"

  $scope.categories = []
  catContainer = $element[0].querySelector "ul"
  masonry = new Masonry catContainer

  $scope.$watch (-> catContainer.childElementCount), ->
    for child in catContainer.children then masonry.appended child
    masonry.layout()

  categories = Categories.getAll()
  for category in categories
    # The sprite is the classname we will use to add the category's image
    category.sprite = (category.name.replace ",", " ").split(" ")[0].toLowerCase()
    # Add the click handler
    category.extraClass = ""
    category.toggleChildren = ->
      @extraClass = if @extraClass is "show-children" then "" else "show-children"
      setTimeout (-> masonry.layout()), 100

  $scope.categories = categories


exports.$inject = [
  "$element"
  "$scope"
  "$location"
  "$log"

  "models.categories"
]
