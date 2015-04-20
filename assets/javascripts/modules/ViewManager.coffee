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

    @resources.router.on 'change', @routeHandle
    @progressBar = new @components.progressBar


  start: ->
    # Render different components
    @header = new (@components.header)(el: 'header', resources: @resources)

    # Attach different listeners
    @header.trigger 'start'
    @header.trigger 'continue'

    @started = true
    if @currentView
      if @currentView.checkRedirect()
        @progressBar.progress 100
        return @resources.router.redirect @currentView.redirectUrl()

      @currentView.trigger 'continue'
      @resources.router.reattachRouter()

  ###
  ## *routeHandle(args):*
  This function is called when the route of the current app has changed. This
  function is responsible for making sure of properly unloading the previous
  view and loading the next view.
  ###
  routeHandle: (args={}) =>
    viewIdentifier = args.view
    historyState = args.state

    console.log @name, "setting view to:", viewIdentifier
    console.debug @name, "using history:", historyState

    @resources.historyState = historyState
    @setView viewIdentifier, historyState
    @resources.currentView = @currentView
    @resources.currentViewName = viewIdentifier

    @googleAnalyticsSend()


  ###
  ## *setView(viewIdentifier, historyState):*
  Sets the current view, performing all the necessary actions, animations and
  DOM manipulations.
  ###
  setView: (viewIdentifier, historyState={}) ->
    # Change the mouse icon to the loader
    @displayMouseLoader true

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


  ###
  ## *switchPages(targetViewIdentifier, historyState):*
  This function is called specifically when there is a view that is already
  initialized and has to be replaced with a new target view.
  ###
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


  # Sets the mouse pointer to the loading icon.
  displayMouseLoader: (shown=true) -> ($ "body").toggleClass "wait", shown


  # Finds the view with the given name and returns it's object.
  getView: (viewIdentifier) -> @pages[viewIdentifier]


  destroyUnwantedViews: (historyIndex) ->
    index = 0
    for view in @viewBuffer
      if not view? or not view.$el? then continue
      viewIndex = Number view.$el.data 'index'
      # Destroy views that are in forward of history and those that are to far
      # behind in history.
      if viewIndex is historyIndex or (historyIndex - viewIndex) > 5
        @viewBuffer[index] = null
        view.trigger 'finish'
      index += 1


  # Function to safely call the Google analytics script
  googleAnalyticsSend: ->
    if ga?
      ga 'send', 'pageview', page: "#{location.pathname}#{location.search}"