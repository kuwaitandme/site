module.exports = Backbone.View.extend
  name: '[view:classified-post:details]'
  template: template['classified/post/details']

  events:
    'change #cat-selector'   : 'parentCategoryChange'
    'change #locations'      : 'locationChange'
    'change #price-selector' : 'priceChange'


  start: (options) ->
    @$address1        = @$ '#address1'
    @$address2        = @$ '#address2'
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



  locationChange: (event) ->
    if @$locations.val()? and @$locations.val() != ""
      @$address1.removeClass "hide"
      @$address2.removeClass "hide"

      # ($ "#page-4-prev, #page-4-next").attr 'href', '#page-maps'
    else
      @$address1.addClass "hide"
      @$address2.addClass "hide"

      # ($ "#page-4-prev").attr 'href', '#page-images'
      # ($ "#page-4-next").attr 'href', '#page-submit'


  validate: (e) ->
    ret = true
    $els = @$ '[required]'

    $els.parent().removeClass 'show-error'
    for el in $els
      $el = $ el
      if not $el.val()
        $el.parent().addClass 'show-error'
        ret = false

    if not @$priceSelector.val()
      @$priceSelector.parent().addClass 'show-error'
      ret = false

    if not @$priceField.val()
      @$priceField.parent().parent().addClass 'show-error'
      ret = false

    if ret then @setModel()
    ret


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


  parentCategoryChange: (event) ->
    val = @$parentCategory.val()
    children = @resources.categories.getChildren val

    if children.length > 0 then @$childCategory.show()
    else @$childCategory.hide()

    @$childCategory.html @generateOption '', 'Choose a child-category'
    addChildCategory = (child) =>
      html = @generateOption child._id, child.name
      @$childCategory.append html

    addChildCategory child for child in children
    window.a = children


  setPrice: (value) ->
    if not value? then @$priceSelector.val ''
    else if value is 0 then @$priceSelector.val 0
    else if value is -1 then @$priceSelector.val -1
    else @$priceSelector.val 1


  # Generates the HTML code for a select option.
  generateOption: (id, name) -> "<option value='#{id}'>#{name}</option>"


  # Initializes the categories option
  initCategories: ->
    @$childCategory.hide()
    for category in @categories
      html = @generateOption category._id, category.name
      @$parentCategory.append html
    @$parentCategory.val 0


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
    contact = @model.get 'contact'

    @$address1.val         contact.address1
    @$address2.val         contact.address2
    @$parentCategory.val  (@model.get 'category') or ""
    @$childCategory.val   (@model.get 'childCategory') or ""
    @$email.val            contact.email
    @$locations.val       (@model.get 'location') or ""
    @$phone.val            contact.phone
    @$type.val             @model.get 'type'
    @setPrice              @model.get 'price'

    @locationChange()