module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder

  # Rewrite the isEmpty condition
  ngModel.$isEmpty = (value={}) ->
    if value.price_type in [0, 1] then return false
    if value.price_type is 2 and value.price_value > 0 then return false
    true


  _formatPrice = (p=0) ->
    "#{p.toString().replace /\B(?=(\d{3})+(?!\d))/g, ','} KWD"

  # Specify how the UI should be updated
  ngModel.$render = ->
    switch Number scope.priceType
      when 0
        scope.priceText = "Free"
        scope.priceValueMin = scope.priceValueMax = null
      when 1
        scope.priceText = "Contact Owner"
        scope.priceValueMin = scope.priceValueMax = null
      when 2
        priceValueMin = Number scope.priceValueMin
        priceValueMax = Number scope.priceValueMax
        priceMin = 0
        priceMax = "Infinity"

        if priceValueMax > 0
          scope.priceValueMax = Math.max priceValueMin, priceValueMax
          priceMax = _formatPrice scope.priceValueMax

        if priceValueMin > 0 then priceMin = _formatPrice scope.priceValueMin

        scope.priceText = "#{priceMin} - #{priceMax}"


  # Update the scope values whenever the model changes
  ngModel.$formatters.push (modelValue={}) ->
    scope.priceType = modelValue.price_type
    scope.priceValueMin = Number modelValue.price_value_min
    scope.priceValueMax = Number modelValue.price_value_max


  # Write data to the model
  read = ->
    scope.$evalAsync -> ngModel.$setViewValue
      price_type: scope.priceType
      price_value_min: scope.priceValueMin
      price_value_max: scope.priceValueMax
    ngModel.$render()


  # These lines constantly call the entire update cycle, whenever their values
  # have been changed.
  scope.$watch "priceType", read
  scope.$watch "priceValueMin", read
  scope.$watch "priceValueMax", read
  # scope.$watch "priceValue", read


  # Function to set set the 'ng-touched' class as needed
  scope.onTouch = -> ngModel.$setTouched()
