module.exports = Backbone.View.extend
	el: '#page-progressbar'
	shown: false
	start: -> @$el.addClass 'show'

	progress: (percent) ->
		if percent < 100
			if not @shown
				@shown = true
				@start()
		else
			@shown = false
			@finish()

		@$el.css 'width', "#{percent}%"

	finish: -> @$el.removeClass 'show'