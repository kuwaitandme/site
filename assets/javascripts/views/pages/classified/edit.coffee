module.exports = (require './post').extend
  name: '[view:classifieds-edit]'
  templateOptions:
    isGuest: false
    hasClassified: true

  getModel: (callback) ->
    id = (document.URL.split '/')[4]
    if not @model? then @model = new @resources.Models.classified _id: id
    @model.fetch success: callback