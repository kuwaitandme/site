module.exports = Backbone.View.extend
	initialize: (options) ->
		if options.$el then	@$el = options.$el
		@model = options.model
		@on "close", @close

	render: ->

	validate: ->
		true

	close: ->
		@remove()
		@unbind()
		@stopListening()