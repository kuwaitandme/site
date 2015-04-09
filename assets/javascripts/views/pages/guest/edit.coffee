view   = require '../classified/post'

module.exports = view.extend
  name: '[view:guest-edit]'
  templateOptions:
    isGuest: true
    hasClassified: true

  checkRedirect: -> false

  getModel: (callback) ->
    id = (document.URL.split '/')[4]
    if not @model? then @model = new @resources.Models.classified _id: id
    @model.fetch success: callback