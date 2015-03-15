module.exports = Backbone.View.extend
	el: '#page-progressbar'
	shown: false

	progress: (percent) ->
		if percent < 99
			if not @shown
				@$el.stop().css 'width', 0
				@shown = true
			@$el.transition
				opacity: 1
				width: "#{percent}%"
		else @finish()


	finish: ->
		self = @
		@shown = false

		properties =
			width: "100%"
			opacity: 0
		@$el.transition properties, ->
			self.$el.css 'width', 0