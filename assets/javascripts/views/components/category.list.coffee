module.exports = Backbone.View.extend
  name: '[comp:category-list]'
  template: template['components/category-list']

  initialize: (options={}) ->
    console.log @name, 'initializing'
    if options.resources then @resources = options.resources

    categories = @resources.categories.toJSON()

    # for category in categories
    #   i = 0
    #   j = 0
    #   for child in category.children
    #     i++
    #     j += i
    #     child.count = i
    #   category.count = j

    @$el.html @template categories: categories
    @$el.masonry
      itemSelector: 'li'
      isFitWidth: true
    @resources.router.reattachRouter()