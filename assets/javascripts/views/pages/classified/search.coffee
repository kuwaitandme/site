module.exports = controller = Backbone.View.extend
	ajaxEnable: true
	ajaxLock: false
	gridMinimumSize: 250
	pageIndex: 0

	collection: new (app.models.classifieds)

	initialize: ->
		console.log '[view:classifieds-search] initializing'
		that = this
		app.loadResource 'masonry'
		app.loadResource 'imagesLoaded'

		# Get the template
		@listTemplate = _.template(@$el.find('#list-template').html())

		# Attach a listener to our collection model
		@listenTo @collection, 'ajax:done', @addClassifieds

		# Do something with the GET parameters here..
		# var url = document.URL;
		# @get = app.helpers.url.getGETstring(url);

		# Setup of local DOM variables
		@$classifiedList = @$el.find('ul#classified-search')
		@$spinner = @$el.find('#ajax-spinner')
		@$ajaxfinish = @$el.find("#ajax-finish")

		# Fire the AJAX event for the first time to load the first set of
		# classifieds
		@fireAjaxEvent()
		@setupMasonry()

		# Set to load new classifieds when we have scrolled to the end of the
		# page.
		$(window).scroll -> if that.ajaxEnable then that.fireAjaxEvent()


	render: ->
		console.log '[view:classifieds-search] rendering'
		that = this
		@resizeClassifieds()


	# A nice little function that resizes all the classifieds into neat columns
	# while maintaining a proper ratio and minimum size. See source for the
	# algorithm used.
	resizeClassifieds: ->
		# Calculate the width of a single 1x1 sqaure. Subtract 5px from th
		# window's width to compensate for the scroll bar
		windowWidth = $(window).width() - 50
		columns = Math.floor(windowWidth / @gridMinimumSize)
		excessSpace = windowWidth - @gridMinimumSize * columns
		finalSize = Math.floor(@gridMinimumSize + excessSpace / columns)

		# Set each of the blocks with the right size
		@$el.find('.classified').width finalSize


	fireAjaxEvent: ->
		if !@ajaxEnable or @ajaxLock then return

		console.log '[view:classifieds-search] firing ajax event'
		if $(window).scrollTop() >= ($(document).height() - $(window).height()) * 0.9
			@ajaxLoadClassifieds()


	# This function performs the AJAX call to load more classified into the
	# DOM while at the same time manipulating the spinner and the UI to let
	# the user know that more classifieds are loading.
	ajaxLoadClassifieds: ->
		@ajaxLock = true

		# Show the spinner while loading
		@$spinner.fadeIn();

		# Obtain the parameters to be sent to the back-end
		@pageIndex += 1
		url = app.helpers.url.insertParam('page', @pageIndex)
		parameters = app.helpers.url.getGETstring(url)

		# Fetch the classifieds from the back-end
		@collection.fetch parameters


	# This function gets called whenever a new model has been added into our
	# collection. This function is responsible for adding the classified
	# into the DOM while properly taking care of aligning it too.
	#
	# @param  [Backbone.Model]  classifieds   An array containing the new
	#                                         classifieds if any.
	addClassifieds: (classifieds) ->
		that = this

		# All done. Hide the spinner and disable the lock
		@$spinner.fadeOut();
		@ajaxLock = false
		console.debug '[view:classifieds-search] adding classifieds', classifieds

		# Reload Masonry once for all the elements
		@$classifiedList.masonry()

		# Signal the ajax controller to stop polling the server and show the
		# no classified message
		if classifieds.length == 0
			@ajaxEnable = false
			@$ajaxfinish.fadeIn()

		# Add each classified into the DOM
		_.each classifieds, (classified) ->
			html = that.listTemplate(classified.toJSON())
			elem = $(html)

			# Append element into DOM and reload Masonry
			that.$classifiedList.append elem
			that.$classifiedList.masonry 'appended', elem

		# Reattach the event handlers for the router
		app.reattachRouter()

		# Reload Masonry again for every-time a new image has been loaded
		reloadMasonry = ->
			that.$classifiedList.masonry()
		imagesLoaded @$classifiedList, reloadMasonry

		# Fire the AJAX event again! In case we haven't filled up the res
		# of the body yet.
		@fireAjaxEvent()


	# Sets up the Masonry objects
	setupMasonry: ->
		@$classifiedList.masonry
			isAnimated: true
			itemSelector: '.classified'