module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder

  # Rewrite the isEmpty condition, so that ngModel can set the invalid class
  # respectively
  ngModel.$isEmpty = ->
    model = ngModel.$viewValue
    if scope.childCategory and model.child_category? then return false
    if scope.parentCategory
      if scope.parentCategory.children.length > 0
        if scope.childCategory then return false
        else return true
      else return false
    true

  # Write data to the model
  read = ->
    scope.$evalAsync -> ngModel.$setViewValue
      parent_category: scope.parentCategory or {}
      child_category: scope.childCategory or {}


  # These lines constantly call the entire update cycle, whenever their values
  # have been changed.
  scope.$watch "parentCategory", read
  scope.$watch "childCategory", read

  scope.onTouch = -> ngModel.$setTouched()
