module.exports = Backbone.View.extend
  sliderAnimateWidth: 200
  name: '[view:header]'
  events:
    'click #search-close' : 'toggleSearchBar'
    'click .search-trigger' : 'toggleSearchBar'
    'click #nav-grabber' : 'toggleHeader'
    'click #subheader a' : 'toggleHeader'
    'click #search-submit' : 'submitQuery'
    "submit" : "submitQuery"


  toggleHeader: -> @$body.toggleClass 'show-subheader'

  initialize: (options) ->
    console.log @name, 'initializing'
    @resources = options.resources

    # Initialize DOM variables
    @$navHome      = @$ '#nav-logo'
    @$navLinks     = @$ '.nav'
    @$nextLink     = @$ '.next'
    @$previousLink = @$ '.prev'
    @$header       = $ 'header'
    @$body         = $ 'body'
    @$sliderNav    = @$ '#slider-nav'
    @$credits      = @$ '.user-credits .count'
    @$username     = @$ '.user-title .name'
    @$userthumb    = @$ '.user-thumb img'

    @scrollHandler()
    # @update()

  populateHeader: ->
    md5 = App.Resources.Library.md5
    currentUser = App.Resources.currentUser

    md5Hash = md5 (currentUser.get 'email') or ''
    gravatarURL = "https://www.gravatar.com/avatar/#{md5Hash}"

    @$credits.html currentUser.get 'credits'
    @$username.html currentUser.get 'name'
    @$userthumb.attr 'src', gravatarURL


  toggleSearchBar: -> @$header.toggleClass 'show-search'
    #search-close

  # This function redirects the app to the classified search page, with the
  # text in the search box set as the keywords in the GET query.
  submitQuery: (event) ->
    event.preventDefault()
    $keywords = @$ "[name='keywords']"

    # Get the keywords and covert it into a GET query
    text = $keywords.val() or ''
    text.replace ' ', '+'

    # Redirect the app to the classified search page.
    url = "/classified/search/?keywords=#{text}"
    @resources.router.redirect url

  scrollHandler: ->
    # self = @

    delta = 5
    didScroll = false
    lastScrollTop = 0
    navbarHeight = @$header.outerHeight()
    # on scroll, let the interval function know the user has scrolled
    ($ window).scroll (event) -> didScroll = true;
    ($ window).resize (event) -> didScroll = true;

    hasScrolled = =>
      st = ($ this).scrollTop()
      # Make sure they scroll more than delta
      if Math.abs(lastScrollTop - st) <= delta and st is not 0 then return

      # If they scrolled down and are past the navbar, add class .nav-up.
      # This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop and st > navbarHeight)
        # Scroll Down
        @$header.addClass 'nav-up'

      # Scroll Up
      else if st + ($ window).height() < ($ document).height()
        @$header.removeClass 'nav-up'

      # 'Scroll up' if the window has been resized and the header has hit
      # the top..
      if st is 0 then @$header.removeClass 'nav-up'

      lastScrollTop = st;

    # run hasScrolled() and reset didScroll status
    setInterval ->
      if didScroll
        hasScrolled()
        didScroll = false
    , 250



  # This function runs some methods and updates the header as per the current
  # page state
  update: ->
    console.log @name, 'updating header'
    routerController = App.Resources.router

    @$el.removeClass 'nav-up'

    # Get the current view from the history API
    currentState = routerController.getHistoryState()
    currentView  = currentState.view

    # Add the 'active' class accordingly
    # (@$ "[data-view] li").removeClass 'active'
    # if @currentView
    #   (@$ "[data-view='#{currentView}'] li").addClass 'active'

    # Depending on the user's current login state. Change the header
    if @resources.currentUser.isAnonymous() then @$body.removeClass 'loggedin'
    else @$body.addClass 'loggedin'

    @populateHeader()