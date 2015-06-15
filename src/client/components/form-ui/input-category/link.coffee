module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder

  # Rewrite the isEmpty condition, so that ngModel can set the invalid class
  # respectively
  ngModel.$isEmpty = ->
    model = ngModel.$viewValue
    if scope.childCategory and model.child_category? then return false
    if scope.parentCategory
      children = scope.parentCategory.children
      if children and children.length > 0
        if scope.childCategory then return false
        else return true
      else return false
    true

  ngModel.$render = ->
    model = ngModel.$modelValue or {}
    scope.parent_category = model.parent_category
    scope.child_category = model.child_category


  # Write data to the model
  read = ->
    scope.$evalAsync -> ngModel.$setViewValue
      parent_category: (scope.parentCategory or {}).id
      child_category: (scope.childCategory or {}).id

  # These lines constantly call the entire update cycle, whenever their values
  # have been changed.
  scope.$watch "parentCategory", read
  scope.$watch "childCategory", read

  scope.onTouch = -> ngModel.$setTouched()
