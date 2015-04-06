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

  continue: ->
    console.log @name, 'continue'
    @classifiedList.continue()

  pause: ->
    console.log @name, 'pause'
    @classifiedList.pause()