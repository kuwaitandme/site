module.exports = Backbone.View.extend
  name: '[comp:category-list]'
  template: template['components/category-list']

  initialize: (options={}) ->
    console.log @name, 'initializing'
    if options.resources then @resources = options.resources

    @$el.html @template categories: @resources.categories.toJSON()
    @$el.masonry
      itemSelector: 'li'
      isFitWidth: true
    @resources.router.reattachRouter()