module.exports = Backbone.View.extend
  name: '[view:landing]'
  template: template['landing']
  title: -> "Publish free classifieds"

  events: "submit" : "formSubmit"

  start: ->
    @$categoryContainer = @$ '#landing-categories'
    @$classifiedList = @$ ".classifiedList"
    @$logo = @$ "#landing-logo img"

    @classifiedList = new @resources.Views.components.classifiedList
      settings:
        isAccount: false
        enableFilterBox: false
      resources: @resources
      el: @$classifiedList
    @$categoryList = @$el.find '#masonry-container .content'
    @$categoryList.hide()


  continue: ->
    console.log @name, 'continue'

    switch window.location.hash
      when "#shared"
        cookieHelper = @resources.Helpers.cookie

        id = cookieHelper.readCookie 'pay-w-tweet'
        authHash = cookieHelper.readCookie 'auth-hash'
        @resources.router.redirect "/classified/finish/#{id}#shared?authHash=#{authHash}"

    if not @categoryList?
      @categoryList = new @resources.Views.components.categoryList
        el: @$categoryContainer
        resources: @resources

    @classifiedList.continue()


  pause: ->
    console.log @name, 'pause'
    @classifiedList.pause()


  # This function redirects the app to the classified search page, with the
  # text in the search box set as the keywords in the GET query.
  formSubmit: (event) ->
    event.preventDefault()
    $keywords = @$ "[name='keywords']"

    # Get the keywords and covert it into a GET query
    text = $keywords.val()
    text.replace ' ', '+'

    # Redirect the app to the classified search page.
    url = "/classified/search/?keywords=#{text}"
    @resources.router.redirect url


  # This method performs the same function as the 'submitClick' method but
  # instead grabs the category too and then redirects the page.
  #
  # The page redirection happens automatically without the user pressing the
  # search button. This is a UX decision.
  selectChange: (event) ->
    $select = @$ "[name='category']"
    $keywords = @$ "[name='keywords']"

    cat = $select.val()
    text = $keywords.val()
    text.replace ' ', '+'

    # Redirect the app to the classified search page.
    url = "/classified/search?category=#{cat}&keywords=#{text}"
    @goto url, 'classified-search'