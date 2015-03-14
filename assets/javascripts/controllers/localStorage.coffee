# EXPLAIN CONTROLLER HERE
#
# This way, we can avoid having the server returning huge responses which
# contain HTML code and instead have the server communicate with JSON
# objects which contain data.
module.exports = class controller

	fallback: false

	# Checks the JS version from the server side and setups the local storage
	# based on it. If the JS version from the local and the server are
	# different, then reset the local storage. Otherwise have the local storage
	# cache every page template that it downloads.
	#
	# Also, if the browser does not support localStorage use fallback methods.
	constructor: (app, @config) ->
		@consoleSlug = '[controller:localstorage]'
		console.log @consoleSlug, 'initializing'

		# Check if localStorage is supported
		if Storage?
			remoteVersion = window.data.jsVersion or 1
			localVersion = (Number localStorage.getItem 'jsVersion') or 0

			# Check if the versions are different or not
			console.debug @consoleSlug, 'local version', localVersion
			console.debug @consoleSlug, 'remote version', remoteVersion
			if localVersion is not remoteVersion
				console.log @consoleSlug, 'flushing local cache'

				# If it is, then clear the cache and set the new version
				localStorage.clear()
				localStorage.setItem 'jsVersion', remoteVersion

			# Cache the startup scripts for the next time the user visits the
			# site
			@cacheStartupScripts()


		else
			# Setup fallback methods
			@fallback = true
			console.log @consoleSlug, 'HTML5 Storage not supported. Using fallback methods'
			console.warn @consoleSlug, 'no fallback methods for localstorage have been implemented so far'


	# This function is responsible for saving all the startup scripts
	# (eg: jQuery, Backbone, Masonry) into the localStorage cache. This way the
	# next time the user open the page, site will immediately load the scripts
	# from the cache and avoid making requests from the CDN.
	#
	# The code that loads the script that is saved in the local path of the app.
	# This is done, because most browsers don't allow cross-browser requests
	# and saving the scripts local is a solution for this.
	cacheStartupScripts: ->
		if @fallback then return

		that = @

		# The list of scripts is accessible to us by the global variable
		# 'scripts'
		for script in scripts

			if script.name is 'app' then continue

			storageIdentifier = "script-" + script.name

			# Check if the script already exists in the cache
			if not localStorage.getItem(storageIdentifier)
				console.log @consoleSlug, "caching script:", script.name

				# Start fetching the local version of the script asynchronously.
				# and save it into the cache.
				ajax = (storageIdentifier, script) ->
					$.ajax
						url: script.localSrc,
						dataType: "text"
						success: (result) ->
							localStorage.setItem storageIdentifier, result
							console.log that.consoleSlug, "cached script:", storageIdentifier

				ajax(storageIdentifier, script)


	# Saves the HTML template of the current view in the HTML5 local-storage.
	# This gets treated as cache and will get loaded the next time the view
	# has been requested. The HTMLs that gets cached is whatever HTMLs code that
	# lies inside the current-view, under the '.html-cache' class
	#
	# Ideally, we would want to put code that never changes in those tags; eg.
	# Underscore templates.
	cacheView: (view, identifier) ->
		if @fallback then return

		# Get the view identifier
		storageIdentifier = 'page-' + identifier

		# Check if this view has been cached or not
		if localStorage.getItem(storageIdentifier) then return

		# If we reach here, then get the HTML we need to cache and store it
		console.log @consoleSlug, 'saving current view to cache'
		html = view.$el.find('.html5-cache').html()

		# Avoid caching empty html
		if !html or html == ''
			return console.warn(@consoleSlug, 'nothing was cached')

		# If all went well, save the html
		localStorage.setItem storageIdentifier, html


	# This function returns the HTML code (if any) that is cached in the local
	# storage.
	getCachedViewHTML: (identifier) ->
		if @fallback then return
		storageIdentifier = localStorage.getItem('page-' + identifier)

		if storageIdentifier then console.log @consoleSlug, 'fetched HTML from cache'
		storageIdentifier


	# Function to store a key-string pair into the cache
	cache: (key, string) ->
		if @fallback then return

		console.log @consoleSlug, 'setting \'' + key + '\' into cache'
		localStorage.setItem key, string


	# Function to get a key-string pair from the cache, given the key
	get: (key) ->
		if @fallback then return

		console.log @consoleSlug, 'retrieving \'' + key + '\' from cache'
		string = localStorage.getItem(key)
		string