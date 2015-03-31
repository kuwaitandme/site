view = (require '../../mainView');
module.exports = view.extend
	ajaxEnable: true
	ajaxLock: false
	gridMinimumSize: 250
	pageIndex: 1

	isAccount: false
	enableFilterBox: true

	name: '[view:classifieds-search]'

	start: (options) ->
		console.debug @name, 'initializing', options

		@collection = new App.Resources.Models.classifieds

		# Get the template
		@listTemplate = _.template (@$ '#list-template').html()

		# Attach a listener to our collection model
		@stopListening @collection, 'ajax:done'
		@listenTo     @collection, 'ajax:done', @addClassifieds

		# Setup of local DOM variables
		@$ajaxfinish =     @$ "#ajax-finish"
		@$classifiedList = @$ 'ul#classified-search'
		@$filterbox =      @$ '#filter-box'
		@$spinner =        @$ '#ajax-spinner'

		@collection.isAccount = @isAccount

		if @enableFilterBox
			@filterbox = new @resources.Views.components.filterBox
				$el: @$filterbox
				resources: @resources
				historyState: @historyState
			@listenTo @filterbox, 'changed', @newQuery

		else @$filterbox.hide()


		@setupMasonry()
		@newQuery()

		# Set to load new classifieds when we have scrolled to the end of the
		# page.
		_.bindAll @, 'onScroll'


	continue: ->
		console.log @name, 'rendering'
		($ window).on 'scroll', @onScroll

		# @collection.isAccount = @isAccount
		@$classifiedList.masonry()

		if @enableFilterBox then @filterbox.render()
		@$spinner.hide()


	pause: -> ($ window).off 'scroll', @onScroll


	onScroll: -> if @ajaxEnable then @fireAjaxEvent()


	newQuery: ->
		routerController = App.Resources.router

		# Blank out all the classifieds we have so far and reset the page count
		$classifieds = @$ ".classified"
		@$classifiedList.masonry 'remove', $classifieds
		@pageIndex = 1

		# Set the height of the container to 0 as it has to reset once the
		# classifieds have been removed
		@$classifiedList.height 0


		# Get the query
		if @enableFilterBox then @query = @filterbox.getQuery() else @query = {}
		@query.page = 0

		if @enableFilterBox
			console.log @name, @enableFilterBox
			# Get the current state from the history API
			currentState = routerController.getHistoryState()

			# Prepare the state to replace the URL with
			if not @isAccount then baseUrl = '/classified/search?'
			else baseUrl = '/account/manage?'
			newUrl = baseUrl + $.param @query

			# Attempt to replace the history state
			routerController.replaceURL newUrl

		# Fire the AJAX event for the first time to load the first set of
		# classifieds
		@ajaxEnable = true
		@fireAjaxEvent()



	# A nice little function that resizes all the classifieds into neat columns
	# while maintaining a proper ratio and minimum size. See source for the
	# algorithm used.
	resizeClassifieds: ->
		console.log @name, 'resizing classifieds'

		# Calculate the width of a single 1x1 sqaure. Subtract 5px from th
		# window's width to compensate for the scroll bar
		windowWidth = ($ window).width()
		columns = Math.floor (windowWidth / @gridMinimumSize)
		excessSpace = windowWidth - @gridMinimumSize * columns
		finalSize = Math.floor (@gridMinimumSize + excessSpace / columns)

		# Set each of the blocks with the right size
		(@$ '.classified').width finalSize - 15


	fireAjaxEvent: ->
		if !@ajaxEnable or @ajaxLock then return

		console.log @name, 'firing ajax event'
		if @$classifiedList.height() == 0 or $(window).scrollTop() >= ($(document).height() - $(window).height()) * 0.9
			@ajaxLoadClassifieds()


	# This function performs the AJAX call to load more classified into the
	# DOM while at the same time manipulating the spinner and the UI to let
	# the user know that more classifieds are loading.
	ajaxLoadClassifieds: ->
		@ajaxLock = true

		# Show the spinner while loading
		@$spinner.fadeIn();

		# Obtain the parameters to be sent to the back-end
		parameters = @query or {}
		parameters.page = @pageIndex
		@pageIndex += 1
		# url = app.helpers.url.insertParam('page', @pageIndex)

		# Fetch the classifieds from the back-end
		@collection.fetch parameters, @accountClassifieds


	# This function gets called whenever a new model has been added into our
	# collection. This function is responsible for adding the classified
	# into the DOM while properly taking care of aligning it too.
	addClassifieds: (classifieds) ->
		self = @

		# All done. Hide the spinner and disable the lock
		@$spinner.fadeOut();
		@ajaxLock = false
		console.debug @name, 'adding classifieds', classifieds

		# Reload Masonry once for all the elements
		@$classifiedList.masonry isFitWidth: true

		# Signal the ajax controller to stop polling the server and show the
		# no classified message
		if classifieds.length == 0
			@ajaxEnable = false
			@$ajaxfinish.fadeIn()

		# Add each classified into the DOM
		for classified in classifieds
			html = self.listTemplate classified.toJSON()
			elem = $ html

			# Append element into DOM and reload Masonry
			self.$classifiedList.append elem
			self.$classifiedList.masonry 'appended', elem

		# Reattach the event handlers for the router
		# app.trigger 'router:refresh'

		# Reload Masonry again for every-time a new image has been loaded
		reloadMasonry = -> self.$classifiedList.masonry()
		imagesLoaded @$classifiedList, reloadMasonry

		# In case we haven't filled up the page, fire the ajax loader again.
		@fireAjaxEvent()

		# For all the classifieds give them their proper size
		#@resizeClassifieds()


	# Sets  Masonry on the classified list
	setupMasonry: ->
		@$classifiedList.masonry
			isAnimated: true
			itemSelector: '.classified'