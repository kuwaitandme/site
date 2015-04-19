module.exports = Backbone.View.extend
  name: '[view:classifieds-search]'
  template: template['classified/search']
  title: -> "Search classifieds"

  start: (options) ->
    @$classifiedList = @$ ".classifiedList"

    @classifiedList = new @resources.Views.components.classifiedList
      settings:
        isAccount: false
        enableFilterBox: true
      resources: @resources
      el: @$classifiedList

    @classifiedList.trigger 'start'


  continue: ->
    Category = @resources.categories
    parentCategory = @resources.historyState.parameters[0]
    childCategory = @resources.historyState.parameters[1]

    @classifiedList.settings.query.parentCategory = Category.findBySlug parentCategory
    @classifiedList.settings.query.childCategory = Category.findBySlug childCategory

    @classifiedList.trigger 'continue'


  pause: -> @classifiedList.trigger 'pause'