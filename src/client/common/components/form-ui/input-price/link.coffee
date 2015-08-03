module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder

  # Rewrite the isEmpty condition
  ngModel.$isEmpty = (value={}) ->
    if value.price_type in [0, 1] then return false
    if value.price_type is 2 and value.price_value > 0 then return false
    true


  # Specify how the UI should be updated
  ngModel.$render = ->
    switch Number scope.priceType
      when 0
        scope.priceText = "Free"
        scope.priceValue = null
      when 1
        scope.priceText = "Contact Owner"
        scope.priceValue = null
      when 2
        price = scope.priceValue or 0
        formattedPrice = price.toString().replace /\B(?=(\d{3})+(?!\d))/g, ","
        scope.priceText = "#{formattedPrice} KWD"


  # Update the scope values whenever the model changes
  ngModel.$formatters.push (modelValue={}) ->
    scope.priceType = modelValue.price_type
    scope.priceValue = modelValue.price_value


  # Write data to the model
  read = ->
    scope.$evalAsync -> ngModel.$setViewValue
      price_type: scope.priceType
      price_value: scope.priceValue
    ngModel.$render()


  # These lines constantly call the entire update cycle, whenever their values
  # have been changed.
  scope.$watch "priceType", read
  scope.$watch "priceValue", read


  # Function to set set the 'ng-touched' class as needed
  scope.onTouch = -> ngModel.$setTouched()
