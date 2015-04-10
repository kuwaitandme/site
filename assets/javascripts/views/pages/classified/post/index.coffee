module.exports = Backbone.View.extend
  name: '[view:classified-post]'
  title: -> "Post a classified"
  template: template['classified/post']
  templateOptions:
    isGuest: false
    hasClassified: false

  subViews:
    "#page-begin":   require './part.begin'
    "#page-details": require './part.details'
    "#page-images":  require './part.images'
    "#page-info":    require './part.info'
    # "#page-maps":    require './part.maps'
    "#page-submit":  require './part.submit'


  events: 'click .submit' : 'submitHandle'


  start: (@options) ->
    console.debug @name, 'initializing', @options
    console.log @resources

    # Initialize local variables
    @views = {}
    @currentView = null


  continue: ->
    @getModel =>
      console.log @name, 'rendering', @el

      for href of @subViews
        subView = @subViews[href]
        view = new subView el: @$ href
        view.templateOptions =  @templateOptions
        view.model =  @model
        view.trigger 'start'
        view.trigger 'continue'
        @views[href] = view

      @$submit  = @$ '.submit'
      @$spinner = @$ "#ajax-spinner"
      @$errorMessages = @$ 'ul.error-message'

      @delegateEvents()

  checkRedirect: -> not @isGuest and @resources.currentUser.isAnonymous()
  redirectUrl: -> '/auth/login?error=need_login'

  pause: -> (@$ '#g-recaptcha-response').remove()


  getModel: (callback) ->
    if not @model? then @model = new @resources.Models.classified
    callback()


  # function to display an error message in the current view
  removeAllMessages: -> @$errorMessages.hide().html ''
  displayError: (message) ->
    console.log message
    @$errorMessages.show().append "<li>#{message}</li>"


  # Sends the AJAX request to the back-end
  submitHandle: (event) ->
    console.log @name, 'submitting form', event
    event.preventDefault()

    @removeAllMessages()

    validated = true
    for view of @views
      if @views[view].validate?
        isViewValid = @views[view].validate()
        validated = isViewValid and validated

    console.log @name, 'validating form', validated
    if not validated
      return @displayError 'Some fields have invalid values, please go back and fill them properly'


    for view of @views
      if @views[view].setModel? then @views[view].setModel()

    @$submit.hide()
    @$spinner.show()
    # @model.save()
    @model.uploadServer @onAJAXfinish


  onAJAXfinish: (error, classified={}) =>
    if error
      @$spinner.hide()
      @views["#page-submit"].trigger 'continue'
      return @displayError error

    if not classified.guest then url = "/classified/finish/#{classified._id}"
    else url = "/guest/finish/#{classified._id}?authHash=#{classified.authHash}"

    App.Resources.router.redirect url


  # This function not only cleans up this view, but it also cleans up the
  # subsequent child views as well.
  finish: ->
    # Signal every child view that it's time to close
    for view of @views
      @views[view].trigger "finish"
      @views[view] = null

    @currentView = null
    @views = null