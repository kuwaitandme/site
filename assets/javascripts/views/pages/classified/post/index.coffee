subViews =
  "#page-begin":   require './part.begin'
  "#page-details": require './part.details'
  "#page-finish":  require './part.finish'
  "#page-images":  require './part.images'
  "#page-info":    require './part.info'
  "#page-maps":    require './part.maps'
  "#page-submit":  require './part.submit'


module.exports = Backbone.View.extend
  name: '[view:classified-post]'
  title: -> "Post a classified"
  template: template['classified/post']
  templateOptions:
    isGuest: false
    hasClassified: false

  events: 'click a[data-page-nav]' : 'clickHandler'

  start: (@options) ->
    console.debug @name, 'initializing', @options

    # Initialize local variables
    @views = {}
    @currentView = null

    @on "close", @close


  continue: ->
    @getModel =>
      # Setup listeners and event handlers
      @listenTo @model, 'ajax:done', @onAjaxSuccess
      @listenTo @model, 'post:error', @displayError

      console.log @name, 'rendering', @el
      @navigate "#page-images"


  checkRedirect: -> not @isGuest and @resources.currentUser.isAnonymous()
  redirectUrl: -> '/auth/login?error=need_login'


  pause: -> (@$ '#g-recaptcha-response').remove()


  getModel: (callback) ->
    if not @model? then @model = new @resources.Models.classified
    callback()


  # On successful AJAX request to the server navigate to the finish page.
  onAjaxSuccess: -> @navigate '#page-finish', trigger: true


  # function to display an error message in the current view
  displayError: (message) ->
    @currentView.$el.find('ul.error-message')
      .hide()
      .append "<li>#{message}</li>"
      .fadeIn()


  # Function to get the view to navigate to from the anchor tag.
  clickHandler: (event) ->
    event.preventDefault()
    href = ($ event.currentTarget).attr 'href'
    @navigate href


  # Function to navigate to the view pointed by the href tag
  navigate: (href) ->
    console.log @name, 'navigating to', href

    # If the view wasn't initialized already, initialize it
    if not @views[href]
      console.log @name, 'initializing sub-view:', href
      subView = subViews[href]
      view = new subView el: @$ href
      view.templateOptions =  @templateOptions
      view.model =  @model
      view.trigger 'start'
      @views[href] = view
    else console.log @name, 'reusing sub-view:', href

    console.log @name, 'going to sub-view:', @views[href]

    # Remove all error messages
    ($ 'ul.error-message li').remove()

    # If there was a view before this, then performs some tasks before
    # transitioning to the next view
    if @currentView

      # If the view's validation function failed, stay in the same view
      if @currentView.validate? and not @currentView.validate() then return

      # Animate, render and switch the DOM elements
      $el = @currentView.$el
      console.debug @name, 'animating previous view', @views[href]
      $el.transition { opacity: 0 }, =>
        $el.hide()
        @currentView = @views[href]
        @currentView.trigger 'continue'
        @currentView.$el.show().transition opacity: 1

    else
      # This is the first view, so set the view variable
      @currentView = @views[href]
      @currentView.trigger 'continue'
      @currentView.$el.show().transition opacity: 1


  # This function not only cleans up this view, but it also cleans up the
  # subsequent child views as well.
  finish: ->
    # Signal every child view that it's time to close
    for view of @views
      @views[view].trigger "finish"
      @views[view] = null

    @currentView = null
    @views = null