module.exports = Backbone.View.extend
  name: '[view:classified-post:details]'
  template: template['classified/post/details']

  events:
    'change #cat-selector'        : 'parentCategoryChange'
    'change #childcat-selector'   : 'childCategoryChange'
    'change #locations'           : 'locationChange'
    'change #price-selector'      : 'priceChange'


  start: (options) ->
    @$address1        = @$ '#address1 input'
    @$address2        = @$ '#address2 input'
    @$parentCategory  = @$ '#cat-selector'
    @$childCategory   = @$ '#childcat-selector'
    @$email           = @$ '#email'
    @$locations       = @$ '#locations'
    @$phone           = @$ '#phone'
    @$priceField      = @$ '#price-field'
    @$priceRow        = @$ '#price-row'
    @$priceSelector   = @$ '#price-selector'
    @$type            = @$ '#ctype'

    @categories = @resources.categories.toJSON()
    @locations  = @resources.locations.toJSON()

    @initCategories()
    @initLocations()

  continue: -> @setDOM()

  locationChange: (event) ->
    if @$locations.val()? and @$locations.val() != ""
      (@$ '#address1').removeClass "hide"
      (@$ '#address2').removeClass "hide"
    else
      (@$ '#address1').addClass "hide"
      (@$ '#address2').addClass "hide"


  _validatePrice: (event) ->
    if not @$priceSelector.val()
      @$priceSelector.parent().addClass 'show-error'
      console.error @name, 'price has not been set'
      return false
    else
      customPrice = @$priceField.val()
      if  @$priceSelector.val() is -1 and customPrice > 0
        @$priceField.parent().parent().addClass 'show-error'
        console.error @name, 'price input for custom price has not been set'
        return false
    true

  _validateCategories: (event) ->
    parentVal = @$parentCategory.val()
    childVal = @$childCategory.val()

    @$childCategory.parent().parent().removeClass 'show-error'
    @$parentCategory.parent().removeClass 'show-error'

    if not parentVal
      @$parentCategory.parent().addClass 'show-error'
      console.error @name, 'parent category has not been set'
      return false
    else
      children = (@resources.categories.getChildren parentVal) or []
      if children.length > 0 and (not childVal? or childVal.length == 0)
        @$childCategory.parent().parent().addClass 'show-error'
        console.error @name, 'child category has not been set'
        return false
    true

  _validateType: (event) ->
    type = @$type.val()
    if not type
      @$type.parent().addClass 'show-error'
      console.error @name, 'type has not been set'
      return false
    true


  _validateEmail: (event) ->
    email = @$email.val()
    if not email
      @$email.parent().parent().addClass 'show-error'
      console.error @name, 'email has not been set'
      return false
    true


  validate: ->
    console.log @name, 'validating'
    isValid = @_validateCategories()
    isValid = @_validatePrice() and isValid
    isValid = @_validateType() and isValid
    isValid = @_validateEmail() and isValid

    console.debug @name, 'validation:', isValid
    isValid


  # Handler function to change the price boxes
  priceChange: (event) ->
    val = (@$priceSelector.find ':selected').val()
    switch Number val
      when 0 # Free
        @$priceField.val 0
        @$priceRow.addClass 'hide'
      when 1 # Specify value
        @$priceField.val null
        @$priceRow.removeClass 'hide'
      when -1 # Contact Owner
        @$priceField.val -1
        @$priceRow.addClass 'hide'
    @_validatePrice()


  childCategoryChange: ->
    console.log 'asd'
    @_validateCategories()


  parentCategoryChange: (event) ->
    val = @$parentCategory.val()
    children = @resources.categories.getChildren val

    if children.length > 0 then (@$ '#child-row').removeClass 'hide'
    else (@$ '#child-row').addClass 'hide'

    @$childCategory.html @generateOption '', 'Choose a sub-category'
    addChildCategory = (child) =>
      html = @generateOption child._id, child.name
      @$childCategory.append html

    addChildCategory child for child in children
    @_validateCategories()


  setPrice: (value) ->
    if not value? then @$priceSelector.val ''
    else if value is 0 then @$priceSelector.val 0
    else if value is -1 then @$priceSelector.val -1
    else
      @$priceSelector.val 1
      @priceChange()
      @$priceField.val value


  # Generates the HTML code for a select option.
  generateOption: (id, name) -> "<option value='#{id}'>#{name}</option>"


  # Initializes the categories option
  initCategories: ->
    (@$ '#child-row').addClass 'hide'
    for category in @categories
      html = @generateOption category._id, category.name
      @$parentCategory.append html
    @$parentCategory.val ''


  # Initializes the locations
  initLocations: ->
    for location in @locations
      html = @generateOption location._id, location.name
      @$locations.append html


  setModel: ->
    location = @$locations.val()
    if location is "" then location = null

    @model.set
      category:      @$parentCategory.val()
      childCategory: @$childCategory.val()
      price:         @$priceField.val()
      type:          @$type.val()
      location:      location

    # Set the contact fields
    contact = { }
    checkandset = ($el, field) ->
      value = $el.val()
      if value then contact[field] = value

    checkandset @$phone, 'phone'
    checkandset @$address1, 'address1'
    checkandset @$address2, 'address2'
    checkandset @$email, 'email'

    @model.set contact: contact


  setDOM: ->
    model = @model.toJSON()
    if not model._id then return #temporary hack

    @$address1.val         model.contact.address1
    @$address2.val         model.contact.address2
    @$email.val            model.contact.email
    @$locations.val        model.location or ""
    @$phone.val            model.contact.phone
    @$type.val             model.type

    @setPrice              model.price

    @$parentCategory.val   model.category or ""
    @parentCategoryChange()
    if model.childCategory
      @$childCategory.val    model.childCategory
    @_validateCategories()

    @locationChange()