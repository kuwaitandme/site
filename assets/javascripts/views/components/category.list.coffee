module.exports = Backbone.View.extend
  name: '[comp:category-list]'
  template: template['components/category-list']

  events: "click li .image" : "toggleClassified"

  continue: (options={}) ->
    categories = @resources.categories.toJSON()
    for category in categories
      firstSlug = (category.name.replace ',', ' ').split(' ')[0].toLowerCase()
      category.classname = firstSlug

    @$el.html @template
      lang: @resources.language.currentDictonary
      categories: categories
    @resources.language.translate @$el
    @resources.router.reattachRouter()

    @$container = @$ 'ul'
    @resizeCategories()
    @$container.masonry
      isAnimated: true
      isFitWidth: true
      itemSelector: 'li'

    ($ window).resize => @resizeCategories()


  resizeCategories: ->
    _isSmall = -> (matchMedia Foundation.media_queries.small).matches and
      not (matchMedia Foundation.media_queries.medium).matches

    if _isSmall() then (@$ 'li').width ($ window).width()/2 - 14
    else (@$ 'li').width ($ window).width()/4


  toggleClassified: (event) ->
    $el = ($ event.currentTarget).parent()
    $list = $el.find '.children'
    if $list.height() is 0 then @openClassified $el, $list
    else @closeClassified()

  openClassified: ($el, $list) ->
    @closeClassified()
    $el.addClass 'active'
    $list.css 'height', 'auto'
    height = $list.height()
    @$container.masonry()


  closeClassified: ->
    $el = @$ 'li'

    (@$ '.active').removeClass 'active'

    $list = $el.find '.children'
    $list.height 0
    @$container.masonry()