module.exports = Backbone.View.extend
  sliderAnimateWidth: 200
  name: '[view:header]'
  template: template['components/header']
  events:
    'click #search-close' : 'toggleSearchBar'
    'click .search-trigger' : 'toggleSearchBar'
    'click #nav-grabber' : 'toggleHeader'
    'click #subheader a' : 'toggleHeader'
    'click #search-submit' : 'submitQuery'
    "submit" : "submitQuery"


  toggleHeader: -> @$body.toggleClass 'show-subheader'

  start: (options) ->
    console.log @name, 'initializing'
    @initializeDOM()
    @initializeScrollHandler()


  # Initialize DOM variables
  initializeDOM: ->
    @$body         = $ 'body'
    @$header       = $ 'header'
    @$credits      = @$ '.user-credits .count'
    @$navHome      = @$ '#nav-logo'
    @$navLinks     = @$ '.nav'
    @$nextLink     = @$ '.next'
    @$previousLink = @$ '.prev'
    @$sliderNav    = @$ '#slider-nav'
    @$username     = @$ '.user-title .name'
    @$userthumb    = @$ '.user-thumb img'


  populateHeader: ->
    md5 = @resources.Library.md5
    currentUser = @resources.currentUser.toJSON()
    strategies = @resources.currentUser.loginStrategies

    switch currentUser.loginStrategy
      when strategies.FACEBOOK
        url = "http://graph.facebook.com/#{currentUser.username}/picture?width=80"
      when strategies.GOOGLEPLUS
        url = currentUser.thumb or ''
        url = url.replace 'sz=50', 'sz=80'
      when strategies.TWITTER
        url = currentUser.thumb or ''
        url = url.replace '_normal', '_bigger'
      when strategies.EMAIL
        md5Hash = md5 currentUser.email or ''
        url = "https://www.gravatar.com/avatar/#{md5Hash}"

    @$credits.html currentUser.credits
    @$username.html currentUser.name
    @$userthumb.attr 'src', url


  toggleSearchBar: -> @$el.toggleClass 'show-search'


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


  initializeScrollHandler: ->
    delta = 5
    didScroll = false
    lastScrollTop = 0
    navbarHeight = @$el.outerHeight()

    # on scroll, let the interval function know the user has scrolled
    ($ window).scroll (event) -> didScroll = true;
    ($ window).resize (event) -> didScroll = true;

    hasScrolled = =>
      st = ($ window).scrollTop()
      # Make sure they scroll more than delta
      if Math.abs(lastScrollTop - st) <= delta and st is not 0 then return

      # If they scrolled down and are past the navbar, add class .nav-up.
      # This is necessary so you never see what is "behind" the navbar.
      if st > lastScrollTop and st > navbarHeight
        # Scroll Down
        @$el.addClass 'nav-up'

      # Scroll Up
      else if st + ($ window).height() < ($ document).height()
        @$el.removeClass 'nav-up'

      # 'Scroll up' if the window has been resized and the header has hit
      # the top..
      if st is 0 then @$el.removeClass 'nav-up'

      lastScrollTop = st;

    # run hasScrolled() and reset didScroll status
    setInterval =>
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
    currentView  = @resources.currentViewName

    # Add the 'active' class accordingly
    (@$ "[data-view]").removeClass 'active'
    (@$ "[data-view='#{currentView}']").addClass 'active'

    # Depending on the user's current login state. Change the header
    if @resources.currentUser.isAnonymous() then @$body.removeClass 'loggedin'
    else @$body.addClass 'loggedin'

    @populateHeader()