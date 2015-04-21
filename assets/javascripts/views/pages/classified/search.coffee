module.exports = Backbone.View.extend
  name: "[view:classifieds-search]"
  template: template["classified/search"]
  title: "Search classifieds"
  events: "click #search-filter" : "toggleFilterbox"


  start: (options) ->
    @$classifiedList = @$ ".classifiedList"
    @$filterbox    = @$ "#filterbox"

    @classifiedList = new @resources.Views.components.classifiedList
      settings:
        isAccount: false
        enableFilterBox: true
      resources: @resources
      el: @$classifiedList

    @classifiedList.trigger "start"

    @filterbox = new @resources.Views.components.filterBox el: @$filterbox
    @filterbox.trigger "start"


  continue: ->
    Category = @resources.categories
    parentCategory = @resources.historyState.parameters[0]
    childCategory = @resources.historyState.parameters[1]

    parentCategory = Category.findBySlug parentCategory
    childCategory = Category.findBySlug childCategory

    @classifiedList.settings.query.parentCategory = parentCategory
    @classifiedList.settings.query.childCategory = childCategory

    @classifiedList.trigger "continue"
    @filterbox.trigger "continue"

    if parentCategory.name?
      @title = parentCategory.name
      if childCategory.name? then @title = "#{childCategory.name} - #{@title}"
      @setTitle()


  pause: -> @classifiedList.trigger "pause"


  toggleFilterbox: (event) ->
    $("#filterbox-modal").foundation "reveal","open"
    console.log @name, "show filterbox"