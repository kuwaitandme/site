module.exports = controller = Backbone.View.extend
	ajaxEnable: true
	ajaxLock: false
	gridMinimumSize: 250
	pageIndex: 0
	isAccount: false

	consoleSlug: '[view:classifieds-search]'

	collection: new (app.models.classifieds)

	initialize: ->
		console.log @consoleSlug, 'initializing'
		that = @

		# Get the template
		@listTemplate = _.template(@$el.find('#list-template').html())

		# Attach a listener to our collection model
		@listenTo @collection, 'ajax:done', @addClassifieds

		# Setup of local DOM variables
		@$ajaxfinish = @$el.find "#ajax-finish"
		@$classifiedList = @$el.find 'ul#classified-search'
		@$filterbox = @$el.find '#filter-box'
		@$spinner = @$el.find '#ajax-spinner'


		@filterbox = new app.views.components.filterBox
			$el: @$filterbox

		@listenTo @filterbox, 'changed', @newQuery

		# Set to load new classifieds when we have scrolled to the end of the
		# page.
		$(window).scroll -> if that.ajaxEnable then that.fireAjaxEvent()


	render: ->
		console.log @consoleSlug, 'rendering'

		@collection.isAccount = @isAccount
		@$spinner.hide()
		@filterbox.render()
		@setupMasonry()
		@newQuery()


	checkRedirect: -> false


	newQuery: ->
		# Blank out all the classifieds we have so far and reset the page count
		$classifieds = @$ ".classified"
		@$classifiedList.masonry 'remove', $classifieds
		@pageIndex = 0

		# Get the query
		@query = @filterbox.getQuery()

		# Fire the AJAX event for the first time to load the first set of
		# classifieds
		@fireAjaxEvent()

		# For all the classifieds give them their proper size
		@resizeClassifieds()


	# A nice little function that resizes all the classifieds into neat columns
	# while maintaining a proper ratio and minimum size. See source for the
	# algorithm used.
	resizeClassifieds: ->
		# Calculate the width of a single 1x1 sqaure. Subtract 5px from th
		# window's width to compensate for the scroll bar
		windowWidth = ($ window).width() - 50
		columns = Math.floor windowWidth / @gridMinimumSize
		excessSpace = windowWidth - @gridMinimumSize * columns
		finalSize = Math.floor @gridMinimumSize + excessSpace / columns

		# Set each of the blocks with the right size
		(@$ '.classified').width finalSize


	fireAjaxEvent: ->
		if !@ajaxEnable or @ajaxLock then return

		console.log @consoleSlug, 'firing ajax event'
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
		parameters = @query or {}
		parameters.page = @pageIndex
		# url = app.helpers.url.insertParam('page', @pageIndex)

		# Fetch the classifieds from the back-end
		@collection.fetch parameters, @accountClassifieds


	# This function gets called whenever a new model has been added into our
	# collection. This function is responsible for adding the classified
	# into the DOM while properly taking care of aligning it too.
	addClassifieds: (classifieds) ->
		that = this

		# All done. Hide the spinner and disable the lock
		@$spinner.fadeOut();
		@ajaxLock = false
		console.debug @consoleSlug, 'adding classifieds', classifieds

		# Reload Masonry once for all the elements
		@$classifiedList.masonry()

		# Signal the ajax controller to stop polling the server and show the
		# no classified message
		if classifieds.length == 0
			@ajaxEnable = false
			@$ajaxfinish.fadeIn()

		# Add each classified into the DOM
		for classified in classifieds
			html = that.listTemplate classified.toJSON()
			elem = $ html

			# Append element into DOM and reload Masonry
			that.$classifiedList.append elem
			that.$classifiedList.masonry 'appended', elem

		# Reattach the event handlers for the router
		app.reattachRouter()

		# Reload Masonry again for every-time a new image has been loaded
		reloadMasonry = ->
			that.$classifiedList.masonry()
		imagesLoaded @$classifiedList, reloadMasonry

		# In case we haven't filled up the page, fire the ajax loader again.
		@fireAjaxEvent()


	# Sets  Masonry on the classified list
	setupMasonry: ->
		@$classifiedList.masonry
			isAnimated: true
			itemSelector: '.classified'