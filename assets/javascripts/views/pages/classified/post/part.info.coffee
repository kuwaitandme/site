module.exports = Backbone.View.extend
	name: '[view:classified-post:info]'

	initialize: (options) ->
		if options.model     then     @model = options.model
		if options.$el       then       @$el = options.$el
		if options.resources then @resources = options.resources

		@$description = @$ '#description'
		@$title       = @$ '#title'

		@on "close", @close
		@setDOM()


	validate: ->
		ret = true
		$els = @$ '[required]'
		$els.removeClass 'error'

		if not @$title.val()
			@$title.parent().addClass 'show-error'
			ret = false

		if not @$description.val()
			@$description.parent().addClass 'show-error'
			ret = false

		if ret then @setModel()
		ret


	setModel: ->
		@model.set
			description: @$description.val()
			title:       @$title.val()


	setDOM: ->
		@$description.val @model.get 'description'
		@$title.val       @model.get 'title'


	close: ->
		@remove()
		@unbind()
		@stopListening()