xss = require('xss')

module.exports = Backbone.View.extend
	initialize: (options) ->
		@model = options.model
		@$description = @$el.find('#description')
		@$title = @$el.find('#title')

		# Initialize redactor
		# @$description.redactor()


	render: ->


	validate: ->
		ret = true
		$els = @$el.find('[required]')
		$els.removeClass 'error'
		$els.each (i) ->
			$el = $els.eq(i)
			if !$el.val()
				$el.addClass 'error'
				ret = false
			return
		if !ret then @model.trigger 'post:error', 'Some of the fields are missing'
		else @setModel()
		ret


	setModel: ->
		@model.set
			description: xss(@$description.val())
			title: xss(@$title.val())