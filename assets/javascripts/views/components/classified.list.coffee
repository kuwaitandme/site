urlHelpers = (require 'app-helpers').url

module.exports = Backbone.View.extend
  gridMinimumSize: 250
  pageIndex: 1

  settings:
    ajaxEnable: true
    ajaxLock: false
    isAccount: false
    enableFilterBox: true

  name: '[comp:classified-list]'
  template: template['components/classified-list']

  initialize: (options={}) ->
    if options.resources then @resources = options.resources
    console.log @name, 'initializing'
    console.debug @name, options

    # Extend the settings
    _.extend @settings, options.settings
    console.debug @name, @settings

    # Initialize the collection model
    @collection = new App.Resources.Models.classifieds
    @collection.isAccount = @settings.isAccount

    # Setup the templates
    @$el.html template['components/classified-list']()
    @listTemplate = template['components/classified-list-single']

    @setupDOM()
    @setupListeners()
    @setupFilterBox()
    @setupMasonry()

    @newQuery()

    # Set to load new classifieds when we have scrolled to the end of the page.
    _.bindAll @, 'onScroll'
    _.bindAll @, 'resizeClassifieds'
    ($ window).on 'resize', @resizeClassifieds


  continue: ->
    console.log @name, 'continue'
    ($ window).on 'scroll', @onScroll

    # @collection.isAccount = @isAccount
    @$classifiedList.masonry()

    if @enableFilterBox then @filterbox.render()
    if @settings.ajaxEnable then @$spinner.fadeIn();


  pause: ->
    ($ window).off 'scroll', @onScroll
    ($ window).off 'resize', @resizeClassifieds


  onScroll: -> if @settings.ajaxEnable then @fireAjaxEvent()


  newQuery: ->
    router = @resources.router

    # Blank out all the classifieds we have so far and reset the page count
    $classifieds = @$ ".classified"
    @$classifiedList.masonry 'remove', $classifieds
    @pageIndex = 1

    # Set the height of the container to 0 as it has to reset once the
    # classifieds have been removed
    @$classifiedList.height 0

    # Get the query
    # if @enableFilterBox
    #   @query = @getQuery()
    # else
    #   keywords = (urlHelpers.getParam "keywords")or ""
    #   @query = {}
    #   @query.keywords = if keywords.length > 0 then keywords else null
    @query = @getQuery()
    @query.page = 0

    if @enableFilterBox
      # Get the current state from the history API
      currentState = router.getHistoryState()

      # Prepare the state to replace the URL with
      if not @isAccount then baseUrl = '/classified/search?'
      else baseUrl = '/account/manage?'
      newUrl = baseUrl + $.param @query

      # Attempt to replace the history state
      # router.replaceURL newUrl

    # Fire the AJAX event for the first time to load the first set of
    # classifieds
    @settings.ajaxEnable = true
    @fireAjaxEvent()



  # A nice little function that resizes all the classifieds into neat columns
  # while maintaining a proper ratio and minimum size. See source for the
  # algorithm used.
  resizeClassifieds: ->
    console.log @name, 'resizing classifieds'

    # Calculate the width of a single 1x1 sqaure. Subtract 5px from th
    # window's width to compensate for the scroll bar
    windowWidth = ($ window).width()
    # columns = Math.floor (windowWidth / @gridMinimumSize)
    # excessSpace = windowWidth - @gridMinimumSize * columns
    # finalSize = Math.floor (@gridMinimumSize + excessSpace / columns)

    # Set each of the blocks with the right size
    (@$ '.classified').css 'max-width', windowWidth/2


  fireAjaxEvent: ->
    if not @settings.ajaxEnable or @settings.ajaxLock then return
    console.log @name, 'firing ajax event'

    if @$classifiedList.height() == 0 or
    ($ window).scrollTop() >= (($ document).height() - ($ window).height()) * 0.7
      @ajaxLoadClassifieds()


  # This function performs the AJAX call to load more classified into the
  # DOM while at the same time manipulating the spinner and the UI to let
  # the user know that more classifieds are loading.
  ajaxLoadClassifieds: ->
    @settings.ajaxLock = true

    # Show the spinner while loading
    @$spinner.fadeIn();

    # Obtain the parameters to be sent to the back-end
    parameters = @query or {}
    parameters.page = @pageIndex
    @pageIndex += 1

    # Fetch the classifieds from the back-end
    @collection.fetch parameters, @accountClassifieds


  getQuery: ->
      category:      urlHelpers.getParam 'category'
      childCategory: urlHelpers.getParam 'childCategory'
      keywords:      urlHelpers.getParam 'keywords'
      location:      urlHelpers.getParam 'location'
      priceMax:      urlHelpers.getParam 'priceMax'
      priceMin:      urlHelpers.getParam 'priceMin'
      type:          urlHelpers.getParam 'type'


  # This function gets called whenever a new model has been added into our
  # collection. This function is responsible for adding the classified
  # into the DOM while properly taking care of aligning it too.
  addClassifieds: (classifieds) ->
    imageLoader = @resources.Library.imageLoader

    # All done. Hide the spinner and disable the lock
    @$spinner.fadeOut();
    @settings.ajaxLock = false
    console.log @name, 'adding classifieds'

    # Reload Masonry once for all the elements
    @$classifiedList.masonry()

    # Signal the ajax controller to stop polling the server and show the
    # no classified message
    if classifieds.length == 0
      @settings.ajaxEnable = false
      @$ajaxfinish.fadeIn()

    # Add each classified into the DOM
    for classified in classifieds
      json = classified.toJSON()

      if json.images then json.image = "/uploads/thumb/#{json.images[0]}"

      html = @listTemplate json
      elem = $ html

      if json.images then elem.addClass 'image-loading'

      createSuccessHandler = (elem) => =>
        elem.removeClass 'image-loading'
        @$classifiedList.masonry()

      createFailureHandler = (elem) => =>
        elem.removeClass 'image-loading'
        .addClass 'image-failed'
        @$classifiedList.masonry()

      # Append element into DOM and reload Masonry
      @$classifiedList.append elem
      @$classifiedList.masonry 'appended', elem

      if json.images
        # Use our special function to load the images. This function ensures
        # that the images are loaded smoothly, the containers are setup
        # properly and add the right CSS classes are set for the any effects
        imageLoader json.image,
          # This function is called when a image successfully loads. It makes
          # sure that the *image-loading* class is removed from the parent li
          # and the masonry layout is reset
          success: createSuccessHandler elem
          # This function is called when a image successfully loads. It makes
          # sure that the *image-loading* class is removed from the parent li
          # and the *image-failed* class is set. The masonry layout is reset
          failure: createFailureHandler elem
          target: @$ "#imagecontainer-#{json._id}"

    # Reattach the event handlers for the router
    @resources.router.reattachRouter()

    # In case we haven't filled up the page, fire the ajax loader again.
    @fireAjaxEvent()
    @resizeClassifieds()


  setupListeners: ->
    # Attach a listener to our collection model
    @stopListening @collection, 'ajax:done'
    @listenTo     @collection, 'ajax:done', @addClassifieds



  setupDOM: ->
    # Setup of local DOM variables
    @$ajaxfinish =     @$ ".ajax-finish"
    @$classifiedList = @$ 'ul'
    @$filterbox =      @$ '#filter-box'
    @$spinner =        @$ '.ajax-spinner'


  setupFilterBox: ->
    if @enableFilterBox
      @filterbox = new @resources.Views.components.filterBox
        $el: @$filterbox
        resources: @resources
        historyState: @historyState
      @listenTo @filterbox, 'changed', @newQuery
    else @$filterbox.hide()

  # Sets Masonry on the classified list
  setupMasonry: ->
    @$classifiedList.masonry
      isAnimated: true
      isFitWidth: true
      itemSelector: '.classified'