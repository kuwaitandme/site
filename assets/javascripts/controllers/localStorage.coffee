# EXPLAIN CONTROLLER HERE
#
# This way, we can avoid having the server returning huge responses which
# contain HTML code and instead have the server communicate with JSON
# objects which contain data.
module.exports = controller = ->
	consoleSlug = '[controller:localstorage]'

	# Checks the JS version from the server side and setups the local storage
	# based on it. If the JS version from the local and the server are
	# different, then reset the local storage. Otherwise have the local storage
	# cache every page template that it downloads.
	#
	# Also, if the browser does not support localStorage use fallback methods.
	controller::initialize = (config) ->
		console.log consoleSlug, 'initializing'

		# Check for localStorage
		if typeof Storage != 'undefined'
			remoteVersion = window.jsVersion or 0
			localVersion = localStorage.getItem('jsVersion')

			# Check if the versions are different or not
			if localVersion is not remoteVersion
				console.debug '[controller:localstorage] local version', localVersion
				console.debug '[controller:localstorage] remote version', remoteVersion
				console.debug '[controller:localstorage] flushing local cache'

				# If it is, then clear the cache and set the new version
				localStorage.clear()
				localStorage.setItem 'jsVersion', remoteVersion

		else
			# Setup fallback methods
			@fallback = true
			console.log '[controller:localstorage] HTML5 Storage not supported. Using fallback methods'
			console.warn '[controller:localstorage] no fallback methods for localstorage have been implemented so far'
		return


	# Saves the HTML template of the current view in the HTML5 local-storage.
	# This gets treated as cache and will get loaded the next time the view
	# has been requested. The HTMLs that gets cached is whatever HTMLs code that
	# lies inside the current-view, under the '.html-cache' class
	#
	# Ideally, we would want to put code that never changes in those tags; eg.
	# Underscore templates.
	controller::cacheView = (view, identifier) ->
		if @fallback then return

		# Get the view identifier
		storageIdentifier = 'page-' + identifier

		# Check if this view has been cached or not

		if localStorage.getItem(view) then return

		# If we reach here, then get the HTML we need to cache and store it
		console.log '[controller:localstorage] saving current view to cache'
		html = view.$el.find('.html5-cache').html()

		# Avoid caching empty html
		if !html or html == ''
			return console.warn('[warn] nothing was cached')

		# If all went well, save the html
		localStorage.setItem storageIdentifier, html


	# This function returns the HTML code (if any) that is cached in the local
	# storage.
	controller::getCachedViewHTML = (identifier) ->
		if @fallback
			return
		cache = localStorage.getItem('page-' + view)
		if cache
			console.log '[controller:localstorage] fetched HTML from cache'
		cache


	# [cache description]
	controller::cache = (key, object) ->
		if @fallback then return

		console.log '[controller:localstorage] setting \'' + key + '\' into cache'
		json = JSON.stringify(object)
		localStorage.setItem key, json


	# [get description]
	controller::get = (key) ->
		if @fallback then return

		console.log '[controller:localstorage] retrieving \'' + key + '\' from cache'
		json = localStorage.getItem(key)
		if json then return JSON.parse(json)