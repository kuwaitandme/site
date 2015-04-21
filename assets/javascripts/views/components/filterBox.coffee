module.exports = Backbone.View.extend
  name: '[view:filterbox]'
  events: "click #filterbox-icon" : "showFilterbox"

  query:
    keywords: null
    location: null
    priceMax: null
    priceMin: null
    type: null

  template: template['components/filterbox']


  start: (options) ->
    if options and options.query then @query = options.query

    # Setup DOM elements
    @$keywords       = @$ "#filter-keywords"
    @$parentCategory = @$ "#select-category"
    @$childCategory  = @$ "#select-subcategory"
    @$selectPrice    = @$ "#select-price"
    @$location       = @$ "#select-location"
    @$type           = @$ "#select-type"
    @$submit         = @$ ".submit"
    @$modal          = @$ "#filterbox-modal"
    @keywordsLock = 0


  continue: ->
    urlHelpers = @resources.Helpers.url

    @_initializeCategory()
    @_initializeLocations()

    @delegateEvents()

    # Set the event handler
    handler = (event) => @submitHandle event
    @$parentCategory.on 'change', (event) => @parentCategoryChange event
    @$submit.on 'click', (event) => @submitHandle event

    # Start populating with contents from the URL
    urlQuery =
      keywords: urlHelpers.getParam 'keywords'
      location: urlHelpers.getParam 'location'
      location: urlHelpers.getParam 'location'
      priceMax: urlHelpers.getParam 'priceMax'
      priceMin: urlHelpers.getParam 'priceMin'
      type:     urlHelpers.getParam 'type'

    @populateBox urlQuery


  showFilterbox: -> @$modal.foundation 'reveal', 'open'
  hideFilterbox: -> @$modal.foundation 'reveal', 'close'

  # Populates the box with the given data
  populateBox: (query) ->
    console.log @name, "populating filterbox"
    Category = @resources.categories

    # Set the parent category
    parentCategory = @resources.historyState.parameters[0]
    parentCategory = Category.findBySlug parentCategory
    if parentCategory._id? then @$parentCategory.val parentCategory._id
    @parentCategoryChange()

    # Set the child category
    childCategory = @resources.historyState.parameters[1]
    childCategory = Category.findBySlug childCategory
    if childCategory._id? then @$childCategory.val childCategory._id

    # Set the price
    @setPrice query.priceMax, query.priceMin

    # Set the keywords, the type and the location
    @$keywords.val query.keywords
    @$type.val query.type
    @$location.val query.location


  setPrice: (priceMax, priceMin) ->
    if priceMax is '0' and priceMin is '0' then @$selectPrice.val 'Free'
    if priceMax is '-1' and priceMin is '-1' then @$selectPrice.val 'Contact Owner'

  # Prevent the form from submitting, but instead pass all the query variables
  # to any listeners
  submitHandle: (event) ->
    event.preventDefault null
    @trigger 'changed'


  _initializeLocations: ->
    locationsModel = @resources.locations
    locations = locationsModel.toJSON()
    for location in locations
      html = @generateOption location._id, location.name
      @$location.append html


  # Initializes the parent category options
  _initializeCategory: ->
    categoriesModel = @resources.categories
    categories = categoriesModel.toJSON()
    @$parentCategory.val ""

    # Add the 'all' option
    @$parentCategory.append @generateOption '', 'Everything', false, true

    # Add the rest of the parent categories
    for category in categories
      @$parentCategory.append @generateOption category._id, category.name


  # Generates the option box with the given values
  generateOption: (value, name, disabled=false, selected=false) ->
    attributes = "value='#{ value }'"
    # attributes = ''
    if disabled then attributes += ' disabled'
    if selected then attributes += ' selected'

    "<option #{ attributes }>#{ name }</option>"



  parentCategoryChange: (event) ->
    val = @$parentCategory.val()
    children = @resources.categories.getChildren val
    if children.length > 0 then @$childCategory.parent().removeClass 'hide'
    else @$childCategory.parent().addClass 'hide'

    @$childCategory.html @generateOption '', 'Choose a sub-category'

    addChildCategory = (child) =>
      html = @generateOption child._id, child.name
      @$childCategory.append html
    addChildCategory child for child in children


  getQuery: ->
    query = {}
    switch @$selectPrice.val()
      when "Free" then query.priceMin = query.priceMax = 0
      when "Contact Owner" then query.priceMin = query.priceMax = -1
      else query.priceMin = query.priceMax = ""

    query.category = @$parentCategory.val() or ""
    query.childCategory = @$childCategory.val() or ""
    query.keywords = @$keywords.val() or ""
    query.location = @$location.val() or ""
    query.type = @$type.val() or ""
    query


  submitHandle: ->
    urlHelpers = @resources.Helpers.url
    Category = @resources.categories

    query = @getQuery()

    parentCategory = Category.findById query.category
    childCategory = Category.findById query.childCategory

    url = "classified"
    if parentCategory.slug?
      url = "#{url}/#{parentCategory.slug}"
      if childCategory.slug? then url = "#{url}/#{childCategory.slug}"

    url = "#{url}?#{urlHelpers.serializeGET query}"
    url = "#{@resources.language.urlSlug}/#{url}"

    @resources.router.redirect url
    @hideFilterbox()