# EXPLAIN CONTROLLER HERE
module.exports = class controller
	constructor: (@config) ->
		@consoleSlug = '[controller:resourceLoader]'
		console.log @consoleSlug, 'initializing'

		@$scripts = $('#scripts')
		@resources =
			'2checkout':
				isLoaded: -> typeof recaptcha != 'undefined'
				script: '//www.2checkout.com/checkout/api/2co.min.js'
			dropzone:
				isLoaded: -> typeof Dropzone != 'undefined'
				script: '//cdnjs.cloudflare.com/ajax/libs/dropzone/4.0.1/min/dropzone.min.js'
			googleMaps:
				isLoaded: -> typeof google != 'undefined'
				script: '//maps.googleapis.com/maps/api/js?v=3.exp'
			imagesLoaded:
				isLoaded: -> typeof imagesLoaded != 'undefined'
				script: '//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.1.8/imagesloaded.min.js'
			masonry:
				isLoaded: -> typeof Masonry != 'undefined'
				script: '//cdnjs.cloudflare.com/ajax/libs/masonry/3.2.2/masonry.pkgd.min.js'
			reCaptcha:
				isLoaded: -> typeof recaptcha != 'undefined'
				script: '//www.google.com/recaptcha/api.js'

	loadResource: (identifier) ->
		console.debug @consoleSlug, 'loading resource', identifier
		resource = @resources[identifier]

		if not resource
			return console.log @consoleSlug, 'resource not found'

		if resource.isLoaded()
			return console.log @consoleSlug, 'resource already loaded'

		html = '<script src=\'' + resource.script + '\'></script>'
		@$scripts.append html