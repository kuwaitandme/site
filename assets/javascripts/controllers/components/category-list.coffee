exports = module.exports = ($scope, $location, $element, category) ->
  @name = "[component:category-list]"
  console.log @name, "initializing"

  $scope.categories = []
  $el = angular.element document.querySelectorAll ".categories-list"
  masonry = new Masonry $el[0], transitionDuration: 0

  $scope.$watch (-> $el[0].childElementCount), =>
    for child in $el[0].children then masonry.appended child
    masonry.layout()

  categories = category.getAll()
  for category in categories
    # The sprite is the classname we will use to add the category"s image
    category.sprite = (category.name.replace ",", " ").split(" ")[0].toLowerCase()

    # Add the click handler
    category.extraClass = ""
    category.toggleChildren = ->
      @extraClass = if @extraClass is "show-children" then "" else "show-children"
      setTimeout (-> masonry.layout()), 100

  $scope.categories = categories


exports.$inject = [
  "$scope"
  "$location"
  "$element"
  "model.category"
]