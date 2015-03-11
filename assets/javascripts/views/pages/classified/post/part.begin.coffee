module.exports = Backbone.View.extend
	initialize: (options) ->
		@model = options.model
		@on "close", @close

	render: ->

	validate: ->
		true

	close: ->
		@remove()
		@unbind()
		@stopListening()