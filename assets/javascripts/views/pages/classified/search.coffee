module.exports = (require '../../mainView').extend
  name: '[view:classifieds-search]'
  template: template['classified/search']

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