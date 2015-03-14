module.exports = Backbone.View.extend
	initialize: (@options) ->
		self = @

		@on 'start', ->
			self.start(self.options)
		@on 'continue', ->
			self.$el.show()
			self.undelegateEvents()
			self.delegateEvents()
			self.continue()
		@on 'pause', () ->
			self.undelegateEvents()
			self.pause()
			self.$el.hide()
		@on 'finish', ->
			# self.pause()
			self.finish()
			self.remove()

		@on 'redirect', -> self.redirect()


	# These functions control the view state. These functions are never called
	# directly. Instead events are sent to the view which then triggers the
	# functions accordingly.
	#
	# start() is called once, when the app is initializing the view.
	# continue() is called everytime the app wants to restart the view.
	# pause() is called when the app wants to temporarily switch to another view
	# finish() is called when the app wants to finally kill the view.
	start: ->
	continue: ->
	pause: ->
	finish: ->


	# These two functions decide if the App's control has to be redirected or
	# not.
	#
	# checkRedirect() is used to see if the app's control has to be redirected
	# and redirect is the function that performs the redirection.
	checkRedirect: -> false
	redirect: ->

	# Function to redirect to the router's goto fn.
	goto: (url, view, args) -> app.controllers.router.goto url, view, args