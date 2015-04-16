module.exports = Backbone.View.extend
  name: '[comp:category-list]'
  template: template['components/category-list']

  events: "click li .title" : "toggleClassified"

  initialize: (options={}) ->
    console.log @name, 'initializing'
    if options.resources then @resources = options.resources

    categories = @resources.categories.toJSON()
    for category in categories
      firstSlug = (category.name.replace ',', ' ').split(' ')[0].toLowerCase()
      category.classname = firstSlug

    @$el.html @template
      lang: @resources.language.currentDictonary
      categories: categories
    @resources.language.translate @$el
    @resources.router.reattachRouter()


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

    ($list.height 0).stop().transition height: height


  closeClassified: ->
    $el = @$ 'li'

    (@$ '.active').removeClass 'active'

    $list = $el.find '.children'
    $list.stop().transition height: 0