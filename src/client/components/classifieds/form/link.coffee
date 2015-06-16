module.exports = (scope, element, attributes, ngModel) ->

  ngModel.$render = ->
    modelValue = ngModel.$modelValue or {}
    scope.ctrl ?= {}

    scope.classified = modelValue
    scope.contact = modelValue.contact or {}
    scope.meta = modelValue.meta or {}

    scope.ctrl.categories =
      parent_category: modelValue.parent_category
      child_category: modelValue.child_category
    scope.ctrl.location = modelValue.location

    scope.ctrl.price =
      price_value: modelValue.price_value
      price_type: modelValue.price_type

    scope.ctrl.images = modelValue.images

    if modelValue.meta? and modelValue.meta.gmapX
      scope.ctrl.mapsEnabled = true
      scope.ctrl.maps = gmapX: modelValue.meta.gmapX, gmapY: modelValue.meta.gmapY
