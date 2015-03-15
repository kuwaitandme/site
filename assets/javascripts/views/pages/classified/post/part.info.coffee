xss = require 'xss'

module.exports = Backbone.View.extend
	name: '[view:classified-post:info]'

	initialize: (options) ->
		if options.model then @model = options.model
		if options.$el   then   @$el = options.$el

		@$description = @$ '#description'
		@$title       = @$ '#title'

		@on "close", @close
		@setDOM()


	validate: ->
		ret = true
		$els = @$ '[required]'
		$els.removeClass 'error'
		$els.each (i) ->
			$el = $els.eq(i)
			if not $el.val()
				$el.addClass 'error'
				ret = false
			return
		if not ret then @model.trigger 'post:error', 'Some of the fields are missing'
		else @setModel()
		ret


	setModel: ->
		@model.set
			description: xss @$description.val()
			title:       xss @$title.val())


	setDOM: ->
		@$description.val @model.get 'description'
		@$title.val       @model.get 'title'


	close: ->
		@remove()
		@unbind()
		@stopListening()