###
**MainView**
------------

TODO: Rewrite this

This is the base view for all pages in the App. All pages must inherit
the properties in the view.

The different functions and properties defined
here get used by the ViewManager controller and enables the controller to
neatly cleanup and restart views.
###
module.exports =

  ###
  ## *initialize():*
  This function gets called by Backbone whenever we instantiate an Object from
  this view. Here we not only setup some common resources for all our child
  views to play with, but we also setup some functions that will be the main
  functions the child views will use.
  ###
  initialize: (options={}) ->
    @historyIndex = options.historyIndex
    @resources = App.Resources

    if options.templateOptions? then @templateOptions = options.templateOptions

    ###
    These are events that get called by the ViewManager module. You
    don't have to explicitly trigger them but just ensure that all your
    code lies in the functions defined the below sections.
    ###
    @on 'start', =>
      if @template? then @$el.html @template @templateOptions
      @start()
    @on 'continue', =>
      @setTitle()
      @$el.show()
      @undelegateEvents()
      @delegateEvents()
      @continue()
    @on 'pause', () =>
      @undelegateEvents()
      @pause()
      @$el.hide()
    @on 'finish', =>
      @finish()
      @remove()
      @unbind()
      @stopListening()


  ###
   as
  ###
  templateOptions: {}


  ###
  ## *name:*
  Here goes the name of the view. This is used in console statements
  to help debug the app. So in your view you would use something like

      console.log @name, "Message"

  and this makes it easy to filter out console messages generated by that
  view. (Since the app generates alot of console messages)
  ###
  name: ""

  ###
  ## *title:*
  Use this function to generate the title for the page. It is mandatory
  for every view to define this. UX thing you know...
  ###
  title: -> "Publish free classifieds"
  setTitle: -> document.title = @title() + " | Kuwait and Me"

  ###
  ## *start(), continue(), pause(), finish():*
  These functions control the view state. These functions are never called
  directly. Instead events are sent to the view which then triggers the
  functions accordingly.
  ###

  ###
  **start():**
  This is called once, when the App is initializing the view. Ideally all things
  like attach DOM events and other initializations will go in here.
  ###
  start:    -> console.log @name, "starting"

  ###
  **continue():**
  This is called every time the App wants to restart the view. Things like
  clearing the screen or resetting variables would go in here.
  ###
  continue: -> console.log @name, "continuing"


  ###
  **pause():**
  This is called every-time the App wants to switch to another view and
  temporarily disable this view. Things like disabling event listeners would
  go in here.
  ###
  pause:    -> console.log @name, "pausing"


  ###
  **finish():**
  This is called when the App wants to finally kill the view. The only time when
  the app calls this function is when it realizes it has been caching too many
  views and decides to delete unwanted ones. All cleanup procedures go in here.
  ###
  finish:   -> console.log @name, "finishing"


  ###
  ## *checkRedirect(), redirectUrl():*
  These two functions decide if the App's control has to be redirected or
  not.
  ###

  ###
  **checkRedirect()**:  is used to see if the app's control has to be redirected
  and *redirectUrl()* returns the url to redirect to.
  ###
  checkRedirect: -> false
  redirectUrl: -> '/'