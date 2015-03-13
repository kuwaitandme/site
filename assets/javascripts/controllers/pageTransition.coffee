# EXPLAIN CONTROLLER HERE
module.exports = class controller
	constructor: (@config) ->
		@consoleSlug = '[controller:pageTransition]'
		console.log @consoleSlug, 'initializing'

		# Setup some defaults
		@$main = $('#pt-main')
		@currentPage = 0
		@endCurrentPage = false
		@endTargetPage = false
		@callbackCalled = false

		# CSS animation-end event name
		@animEndEventNames =
			'WebkitAnimation': 'webkitAnimationEnd'
			'OAnimation': 'oAnimationEnd'
			'msAnimation': 'MSAnimationEnd'
			'animation': 'animationend'
		@animEndEventName = @animEndEventNames[Modernizr.prefixed('animation')]

		# Support CSS animations
		@support = Modernizr.cssanimations
		@$pages = @$main.children('div.pt-page')
		@$pages.eq(@currentPage).addClass 'pt-page-current'
		@$pages.eq(@currentPage).data 'index', window.app.controllers.router.historyIndex


	transition: (options) ->
		console.debug @consoleSlug, 'animating with parameters', options
		that = this
		outClass = ''
		inClass = ''

		# Finish any existing animations if there are any
		@finishAnimation()

		# Disable the router temporarily
		app.controllers.router.disabled = true

		# Setup some defaults
		options = options or {}
		@$pages = @$main.children('div.pt-page')
		@$currPage = @$pages.eq(@currentPage)
		pagesCount = @$pages.length
		@$pages.each ->
			$page = $(this)
			$page.data 'originalClassList', $page.attr('class')

		# Get the target page and add the 'pt-page-current' class to it
		if options.$targetPage then @$targetPage = options.$targetPage
		else @$targetPage = @$pages.eq(@currentPage)

		@$targetPage.addClass 'pt-page-current'

		# if(options.vertical) {
		# 	direction1 = 'pt-page-moveToRightEasing pt-page-ontop';
		# 	direction2 = 'pt-page-moveFromLeft'
		# }
		options.direction = if options.reverse then 'fromLeft' else 'fromRight'
		switch (options.direction)
			# when 'fromBottom'
			# when 'fromTop'
			when 'fromLeft'
				# outClass = 'pt-page-moveToRightEasing pt-page-ontop'
				# inClass = 'pt-page-moveFromLeft'
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
			else
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				# outClass = 'pt-page-moveToLeftEasing pt-page-ontop'
				# inClass = 'pt-page-moveFromRight'

		# Setup callback functions when the animation ends on the current page
		@$currPage.addClass(outClass).on that.animEndEventName, ->
			that.$currPage.off that.animEndEventName
			that.endCurrentPage = true

			if that.endTargetPage then that.finishAnimation()

		# Setup callback functions when the animation ends on the target page
		@$targetPage.addClass(inClass).on that.animEndEventName, ->
			that.$targetPage.off that.animEndEventName
			that.endTargetPage = true

			if that.endCurrentPage then that.finishAnimation()

		if !@support then @finishAnimation()


	# This function is what gets called when the CSS animation finishes
	# animating the page transitions. This is also a neat way to force the
	# animation to stop.
	finishAnimation: ->
		if !@endCurrentPage and !@endTargetPage then return
		if !@$currPage and !@$targetPage then return

		# Setup some flags to signal that the animation is over

		@endCurrentPage = false
		@endTargetPage = false
		@resetPage()

		# Re-enable the router
		app.controllers.router.disabled = false


	# Resets the CSS styles for the pages that were being animated. This
	# way we stop the CSS animations and return the classes that were removed
	# back to the pages they were originally on.
	resetPage: ->
		@$currPage.attr 'class', (@$currPage.data 'originalClassList')
		@$currPage.removeClass 'pt-page-current'

		@$targetPage.attr 'class', (@$targetPage.data 'originalClassList')
		@$targetPage.addClass 'pt-page-current'