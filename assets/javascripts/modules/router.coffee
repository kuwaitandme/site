module.exports = Backbone.Router.extend
  name: '[router]'
  fallback: false

  routes:
    "about(/)"                 : "about"
    "account(/)"               : "account"
    "account/credits(/)"       : "accountCredits"
    "account/manage(/)"        : "accountManage"
    "auth/login(/)"            : "authLogin"
    "auth/logout(/)"           : "authLogout"
    "auth/signup(/)"           : "authSignup"
    "auth/signup(/)"           : "authSignup"
    "classified/finish/:id(/)" : "classifiedFinish"
    "classified/post(/)"       : "classifiedPost"
    "classified/search(/)"     : "classified"
    "contact(/)"               : "contact"
    "guest/finish/:id(/)"      : "guestFinish"
    "guest/post(/)"            : "guestPost"
    "terms-privacy(/)"         : "termsprivacy"

    "classified/:id(/)"        : "classifiedSingle"
    "classified/:id/edit(/)"   : "classifiedEdit"
    "guest/:id(/)"             : "guestSingle"
    "guest/:id/edit(/)"        : "guestEdit"

    "*default"                 : "landing"

  about:                    -> @handleRoute 'about'
  account:                  -> @handleRoute 'account-index'
  accountCredits:           -> @handleRoute 'account-credits'
  accountManage:            -> @handleRoute 'account-manage'
  authLogin:                -> @handleRoute 'auth-login'
  authLogout:               -> @handleRoute 'auth-logout'
  authSignup:               -> @handleRoute 'auth-signup'
  classified:               -> @handleRoute 'classified-search'
  classifiedEdit:   (param) -> @handleRoute 'classified-edit', param
  classifiedFinish: (param) -> @handleRoute 'classified-finish', param
  classifiedPost:           -> @handleRoute 'classified-post'
  classifiedSingle: (param) -> @handleRoute 'classified-single', param
  contact:                  -> @handleRoute 'contact'
  credits:                  -> @handleRoute 'credits'
  guestFinish:      (param) -> @handleRoute 'guest-finish', param
  guestEdit:        (param) -> @handleRoute 'guest-edit', param
  guestPost:                -> @handleRoute 'guest-post'
  guestSingle:      (param) -> @handleRoute 'guest-single', param
  landing:                  -> @handleRoute 'landing'
  termsprivacy:             -> @handleRoute 'terms-privacy'


  # A simple route handler that fires the 'change' event along with all
  # necessary parameters of the route.
  handleRoute: (view, parameters) ->
    console.log @name, 'routing to view:', view

    @setHistoryState()
    state = @getHistoryState()
    state.parameters = parameters
    @trigger 'change', { view: view, state: state }


  initialize: (config) ->
    console.log @name, 'initializing'

    # Check if HTML5 history is available or not
    if history and not history.pushState? then return @fallback = true

    # Set the history index and replace the current state
    @historyIndex = window.history.length
    window.history.replaceState {index: @historyIndex}, '', document.URL

    console.log @name, 'initializing current history state'
    console.debug @name, 'state:', window.history.state

    # Attach event handlers
    @on 'change', @reattachRouter
    ($ window).on 'popstate', (event) => @popstateHandle event


  start: ->
    console.log @name, 'starting Backbone history'
    Backbone.history.start
      pushState: true,
      hashChange: false,
      root: '/'


  # This function is responsible for properly resetting the history counter
  # if the user is going backwards in history.
  #
  # It is called every-time a HTML5 popstate event occurs.
  popstateHandle: ->
    if @fallback then return
    state = @getHistoryState()

    console.log @name, 'handling popstate event'

    # If state was defined, then this was a popstate (backward), so reset
    # our index to the index of the popped state.
    if state? and state.index? then @historyIndex = state.index


  # This function is responsible for properly setting the history state and
  # incrementing the history-index if the user is moving forward in history.
  #
  # It is called every-time the user navigates to a page. It fires
  # irrespective if the user goes forward or backwards and handles each case
  # properly.
  setHistoryState: ->
    if @fallback then return
    state = @getHistoryState()

    # If the state index is not defined, then this is a pushstate. So
    # increment our index by 1.
    if state? and not state.index? then @historyIndex += 1
    window.history.replaceState {index: @historyIndex}, '', document.URL


  # This is a safe function that returns the current history state.
  getHistoryState: -> if @fallback then {} else window.history.state or {}


  # Event handler to switch the view in the main page. This event gets
  # fired on anchor tag with the 'data-view' property set. The 'data-view'
  # contains the name of the view that we should look for, and the
  # href will contain the url which should be displayed in the browser.
  hrefEventHandler: (event) ->
    event.preventDefault()
    href = ($ event.currentTarget).attr 'href'
    @navigate href, trigger: true


  # A simple shorthand function to redirect the app.
  redirect: (url) -> @navigate url, trigger: true


  replaceURL: (url) ->
    if @fallback then return
    window.history.replaceState index: @historyIndex, '', url


  # Reattaches all the view links to use the given event handler. The handler
  # is only attached to anchor tag with the [data-view] attribute.
  reattachRouter: ->
    console.log @name, 'reattaching href event handlers'

    ($ 'a[data-view]').unbind 'click'
    ($ 'a[data-view]').bind 'click', (event) => @hrefEventHandler event