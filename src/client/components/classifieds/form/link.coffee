module.exports = (scope, element, attributes, ngModel) ->

  ngModel.$render = ->
    modelValue = ngModel.$modelValue or {}

    scope.classified = modelValue
    scope.categories =
      parent_category: modelValue.parent_category
      child_category: modelValue.child_category
    scope.location = modelValue.location

    scope.price =
      price_value: modelValue.price_value
      price_type: modelValue.price_type

    scope.contact = modelValue.contact
    scope.images = modelValue.images
    scope.meta = modelValue.meta

    if modelValue.meta? and modelValue.meta.gmapX
      scope.form.mapsEnabled = true
      scope.maps = X: modelValue.meta.gmapX, Y: modelValue.meta.gmapY
