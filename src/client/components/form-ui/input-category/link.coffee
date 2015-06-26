module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder

  isCategoryValid = (cat) -> cat? and typeof cat.id is "number"

  # Rewrite the isEmpty condition, so that ngModel can set the invalid class
  # respectively
  ngModel.$isEmpty = ->
    if isCategoryValid(scope.parentCategory) and
    isCategoryValid scope.childCategory then false
    else true


  ngModel.$render = ->
    model = ngModel.$modelValue or {}
    scope.parent_category = model.parent_category
    scope.child_category = model.child_category


  # Write data to the model
  read = ->
    if isCategoryValid scope.childCategory
      child = scope.childCategory.id
    if isCategoryValid scope.parentCategory
      parent = scope.parentCategory.id

    scope.$evalAsync -> ngModel.$setViewValue
      child_category: child
      parent_category: parent


  # These lines constantly call the entire update cycle, whenever their values
  # have been changed.
  scope.$watch "parentCategory", read
  scope.$watch "childCategory", read

  scope.onTouch = -> ngModel.$setTouched()
  ngModel.$validate()
