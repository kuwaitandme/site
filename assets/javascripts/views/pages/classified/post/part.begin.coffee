module.exports = Backbone.View.extend
	name: '[view:classified-post:begin]'

	initialize: (options) ->
		if options.model then @model = options.model
		if options.$el   then   @$el = options.$el

		@on "close", @close


	validate: -> true

	close: ->
		@remove()
		@unbind()
		@stopListening()