module.exports = Backbone.View.extend
	el: '#page-progressbar'
	shown: false

	start: -> @$el.css 'opacity', 1

	progress: (percent) ->
		if percent < 100
			if not @shown
				@shown = true
				@start()
		else
			@shown = false
			@finish()

		@$el.css 'width', "#{percent}%"

	finish: -> @$el.css 'opacity', 0