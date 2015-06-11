module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder

  # Specify how the UI should be updated
  ngModel.$render = ->
    switch Number scope.priceType
      when 0 then scope.priceText = "Free"
      when 1 then scope.priceText = "Contact Owner"
      when 2
        price = scope.priceValue.toString()
        formattedPrice = price.replace /\B(?=(\d{3})+(?!\d))/g, ","
        scope.priceText = "#{formattedPrice} KWD"

  # Update the scope values whenever the model changes
  ngModel.$formatters.push (modelValue) ->
    scope.priceType = modelValue.priceType
    scope.priceValue = modelValue.priceValue

  # Parse the view values before sending them back to the modal to be updated
  ngModel.$parsers.push (viewValue) ->
    modelValue = ngModel.$modelValue
    modelValue.priceType = viewValue.priceType
    modelValue.priceValue = viewValue.priceValue
    modelValue

  # Write data to the model
  read = ->
    scope.$evalAsync -> ngModel.$setViewValue
      priceType: scope.priceType
      priceValue: scope.priceValue
    ngModel.$render()

  # These lines constantly call the entire update cycle, whenever their values
  # have been changed.
  scope.$watch "priceType", read
  scope.$watch "priceValue", read
