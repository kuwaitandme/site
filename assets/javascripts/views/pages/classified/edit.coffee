url    = (require 'app-helpers').url
view   = require './post'

module.exports = view.extend
	name: '[view:classifieds-edit]'
	templateOptions:
		isGuest: false
		hasClassified: true

  getModel: ->
    id = (document.URL.split '/')[4]

    if not @model? then @model = new @resources.Models.classified
      _id: id
    @model.fetch()
    console.log this