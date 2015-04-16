
module.exports = class viewManager
  name: '[viewManager]'

  components:  (require 'app-views').components
  pages:       (require 'app-views').pages

  viewBuffer: []

  # Setup the different views. ie. Initialize the different controllers for
  # the header, currentView and other components.
  constructor: (@resources) ->
    console.log @name, 'initializing'

    # Cache some DOM variables
    @$body           = $ 'body'
    @$main           = $ 'main'

    # Render different components
    @header = new (@components.header)(el: 'header', resources: @resources)
    # @messages = new (@components.messages)(el: '#messages')
    @progressBar = new @components.progressBar

    @resources.router.on 'change', @routeHandle


  start: ->
    # Attach different listeners
    @header.trigger 'start'
    @header.trigger 'continue'

    console.log @name, 'starting'
    @started = true
    if @currentView
      if @currentView.checkRedirect()
        @progressBar.progress 100
        return @resources.router.redirect @currentView.redirectUrl()

      @currentView.trigger 'continue'
      @resources.router.reattachRouter()

  routeHandle: (args={}) =>
    viewIdentifier = args.view
    historyState = args.state

    console.log @name, "setting view to:", viewIdentifier
    console.debug @name, "using history:", historyState

    @resources.historyState = historyState
    @setView viewIdentifier, historyState
    @resources.currentView = @currentView
    @resources.currentViewName = viewIdentifier

    # Signal google Analytics
    @googleAnalyticsSend()


  # Set's the currentView with all the proper animations and DOM
  # manipulations.
  setView: (viewIdentifier, historyState={}) ->
    # Change the mouse icon to the loader
    @displayMouseLoader true

    # Clear any messages
    # @messages.clear()    # Get the view

    # Check if there was a view before, and if there was then switch the pages
    if @currentView? then @switchPages viewIdentifier, historyState
    else @initPage viewIdentifier, historyState

    @$body.attr 'id', viewIdentifier

    # Attach the basic resources to the view
    @currentView.resources = @resources

    if @started
      # Check for any redirection
      if @currentView.checkRedirect()
        @progressBar.progress 100
        return @resources.router.redirect @currentView.redirectUrl()

      # Now signal the view to manipulate the DOM.
      @currentView.trigger 'continue'

    # All done, set the mouse icon to normal
    @displayMouseLoader false
    @progressBar.progress 100

    @resources.router.reattachRouter()


  initPage: (targetViewIdentifier, historyState) ->
    console.log @name, 'initializing first view'
    @currentViewName = targetViewIdentifier

    targetView = @getView targetViewIdentifier
    url = document.URL
    index = historyState.index

    options =
      # el: ".pt-page[data-url='#{url}'][data-index='#{index}']"
      historyState: historyState
      resources: @resources

    # Load set the currentView directly without any transitioning
    @currentView = new targetView options
    @$main.append @currentView.$el
    @currentView.$el.attr 'data-index', index
    .attr 'data-url', url

    # Save the view in our buffer
    @viewBuffer.push @currentView

    # Start the view
    @currentView.trigger 'start'



  switchPages: (targetViewIdentifier, historyState) ->
    # Clean up the view before switching to the next one. Detach
    # all event handlers and signal the view to run any 'closing'
    # animations.
    @currentViewName = targetViewIdentifier

    # Read the history state to see if we are moving backward or
    # forward.
    reverse = historyState.reverse or false

    # Pause current page
    @currentView.trigger 'pause'

    targetView = @findTargetView historyState

    if not targetView
      console.debug @name, "view not found", targetViewIdentifier

      # Create a new view
      targetView = @createTargetView targetViewIdentifier, historyState

      # start target view
      targetView.trigger 'start'

    @currentView = targetView


  createTargetView: (targetViewIdentifier, historyState) ->
    console.debug @name, "creating new view", targetViewIdentifier

    ($ window).scrollTop 0

    index = historyState.index
    url = document.URL

    $targetPage = $ "<div data-url='#{url}' data-index='#{index}'></div>"
      .addClass 'pt-page'
      .addClass targetViewIdentifier

    options =
      historyState: historyState
      resources: @resources

    view = @getView targetViewIdentifier
    targetView = new view options

    @$main.append targetView.$el
    targetView.$el.attr 'data-index', index
    .attr 'data-url', url

    # Save the view in our buffer and return
    @destroyUnwantedViews index
    @viewBuffer.push targetView
    targetView



  findTargetView: (historyState) ->
    console.log @name, "trying to find view in buffer"
    index = historyState.index
    url = document.URL

    for view in @viewBuffer
      if view? and view.$el? and
      (view.$el.data 'url') is url and
      (view.$el.data 'index') is index
        console.log @name, "view found in buffer. reusing view"
        return view




  # Fetches the HTML for the given view and returns it. This function first
  # checks the local-storage if the view's HTML has been cached or not.
  # If the view has been cached, then it loads the HTML from it and returns.
  # If the view wasn't cached, then the function loads the HTML via a AJAX
  # request.
  fetchHTML: (view, url) ->
    console.log @name, 'trying to find HTML in cache for view', view
    html = @resources.cache.getCachedViewHTML view

    if html
      console.log @name, 'HTML found from cache!'
      return html

    console.debug @name, 'no HTML in cache, fetching HTML via AJAX', url
    $.ajax
      type: 'GET'
      url: url
      async: false
      success: (response) ->
        html = (($ response).find '.html5-cache').parent().html()
      error: (response) ->
        console.error @name, 'error sending GET request', response
    html


  # Sets the mouse pointer to the loading icon.
  displayMouseLoader: (shown=true) -> ($ "body").toggleClass "wait", shown


  # Finds the view with the given name and returns it's object.
  getView: (viewIdentifier) -> @pages[viewIdentifier]


  destroyUnwantedViews: (historyIndex) ->
    index = 0
    for view in @viewBuffer
      if not view? or not view.$el? then continue
      viewIndex = Number view.$el.data 'index'

      # Destroy views that are in forward of history and those that are
      # to far behind in history.
      if viewIndex is historyIndex or (historyIndex - viewIndex) > 5
        @viewBuffer[index] = null
        view.trigger 'finish'
      index += 1


  # Function to safely call the Google analytics script
  googleAnalyticsSend: ->
    if ga?
      ga 'send', 'pageview', page: "#{location.pathname}#{location.search}"