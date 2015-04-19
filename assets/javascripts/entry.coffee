###
**Frontend Javascript App**
---------------------------
This file bootstraps the front-end app. Javascript execution begins from here.
The App is heavily dependent on BackBone, Underscore and jQuery.

The App is designed with an MVC framework in mind although with Backbone, your
views become your controller. The App also contains *modules*, which are
components that do different things like routing/caching.

Read the comments at the end of the page if you are trying to trace how the
application works
###
if not window.App?

  ###
  ## *window.App*
  This variable is particularly important because it contains all the bits and
  pieces of our App. Even the application's running instance!

  This variable is made global so that different components of the App have a
  uniformed way of accessing different components/resources.
  ###
  window.App =
    Cache:       (require "app-modules").cache
    Router:      (require "app-modules").router
    ViewManager: (require "app-modules").viewManager
    Language:    (require "app-modules").language
    External:    (require "app-modules").external

    Resources:
      Config:     require "app-config"
      Helpers:    require "app-helpers"
      Library:    require "app-libs"
      Models:     require "app-models"
      Views:      require "app-views"
    instance:     null


  ###
  ## class *Main*
  This class represents the main class of the app. There should be only one
  instance of this class during a user's window session.
  ###
  class Main
    name: "[app]"


    ###
    ## *constructor():*
    This function starts of the app by initializing it's various components.
    ###
    constructor: () ->
      ($ "#page-loader").hide()
      @decodeData()
      @applyBackboneHacks()

      @initializeListeners()
      @initializeResources()
      @initializeViews()
      @initializeBackBone()


    ###
    ## *initializeViews():*
    This function initializes the *ViewManager* and the *Router* which in
    turn initialize all the other subviews
    ###
    initializeViews: ->
      console.log @name, 'initializing views'
      @Router = new App.Router
      @resources.router = @Router
      @ViewManager = new App.ViewManager @resources


    ###
    ## *inintializeListeners():*
    This function initializes the various listeners for the App. (Probably not
    needed)
    ###
    initializeListeners: ->
      console.log @name, 'initializing listeners'
      _.extend this, Backbone.Events


    ###
    ## *decodeServerData():*
    This function decodes the data that is passed from the server-side. This
    data is simple base64 encoded and so this function simply base64 decodes it.
    ###
    decodeData: ->
      console.log @name, 'decoding base64 encode data'
      base64 = App.Resources.Library.base64
      window.data = JSON.parse base64.decode window.data


    ###
    ## *initializeBackBone():*
    Initializes the Backbone components. Basically the router is only thing
    that needs to be started, so we start the *Backbone.history* here.
    ###
    initializeBackBone: ->
      # Start Backbone.history to trigger the different routes and to load
      # the first route. Start history with HTML5 *pushstate* enabled and
      # *hashChange* disabled. This way we can avoid hash-urls in our
      # application.
      Backbone.history.start
        pushState: true,
        hashChange: false,
        root: '/'


    ###
    ## *applyBackboneHacks():*
    Probably one of the most useful functions in the code. This function
    rewrites some of the Backbone components such as the Backbone View and Model
    so that extra features are made available to it. View the content for more
    explanation.
    ###
    applyBackboneHacks: ->
      console.log @name, 'applying Backbone hacks'
      # Rewrite backbone sync with our custom sync function. For now add our
      # little hack to bypass the CSRF token. NOTE that we must find another
      # way to have CSRF added into every AJAX call without having to making
      # more than one request.
      backboneSync = Backbone.sync
      newSync = (method, model, options) ->
        options.beforeSend = (xhr) ->
          # Set the captcha header
          captcha = ($ '[name="g-recaptcha-response"]').val()
          if captcha then xhr.setRequestHeader 'x-gcaptcha', captcha

          # Set the CSRF skipper
          xhr.setRequestHeader 'x-csrf-skipper'
        backboneSync method, model, options
      Backbone.sync = newSync

      newViewProperties = (require "app-views").BackboneView
      _.extend Backbone.View.prototype, newViewProperties

      newModelProperties = (require "app-models").BackboneModel
      _.extend Backbone.Model.prototype, newModelProperties


    initializeResources: ->
      console.log @name, 'initializing resources'
      @resources = App.Resources

      @resources.cache       = new App.Cache
      @resources.categories  = new App.Resources.Models.categories
      @resources.currentUser = new App.Resources.Models.user
      @resources.locations   = new App.Resources.Models.locations
      @resources.language    = new App.Language

      @resources.external    = App.External

      @resources.currentView           = App.ViewManager.currentView
      @resources.categories.resources  = @resources
      @resources.locations.resources   = @resources
      @resources.currentUser.resources = @resources
      @resources.router.resources      = @resources

      asyncCounter = 4
      setAndCheckCounter = =>
        asyncCounter--
        if asyncCounter <= 0 then @viewManager.start()

      @listenToOnce @resources.categories, 'synced', setAndCheckCounter
      @listenToOnce @resources.currentUser, 'synced', setAndCheckCounter
      @listenToOnce @resources.language, 'synced', setAndCheckCounter
      @listenToOnce @resources.locations, 'synced', setAndCheckCounter

      @resources.categories.fetch()
      @resources.currentUser.fetch()
      @resources.language.fetch()
      @resources.locations.fetch()

  ###
  **Main Javascript Execution starts here**
  The code below initializes the foundation library and the App itself.
  ###
  ($ window).ready ->
    console.log '[foundation] initializing'
    $this = ($ document)
    $this.foundation()

    window.App.instance = new Main window.App

else console.log "[lib] app already defined. stopping re-execution of script"