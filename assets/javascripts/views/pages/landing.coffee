view = require './classified/search'
module.exports = view.extend
  name: '[view:landing]'
  title: -> "Publish free classifieds"
  template: template['landing']

  enableFilterBox: false

  events: "submit" : "formSubmit"


  continue: ->
    console.log @name, 'rendering'
    ($ window).on 'scroll', @onScroll

    @collection.isAccount = @isAccount
    @$classifiedList.masonry()

    if @enableFilterBox then @filterbox.render()
    @$spinner.hide()

    @$categoryContainer = (@$ '#landing-categories')
    @setupCategoryContainer()

  setupCategoryContainer: ->
    categoryTemplate = template['components/category-list']
    @$categoryContainer.html categoryTemplate categories: @resources.categories.toJSON()
    @$categoryContainer.masonry
      itemSelector: 'li'
      isFitWidth: true
    @resources.router.reattachRouter()


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
    app.trigger 'redirect', url


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