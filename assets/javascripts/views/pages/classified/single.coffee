view = require '../../mainView'
module.exports = view.extend
	name: "[view:classified-single]"
	messages:
		reported: 'Your report has been successfully submitted'
		notfound: 'Classified was not found'
		needlogin: 'You need to be logged in to make such requests'
		unpriv: 'You are not allowed to make such bogus requests'
		rejected: 'This classified has been rejected by a moderator'
		banned: 'This classified has been banned by a moderator'
		archived: 'This classified has been deleted'


	start: (@options = {}) ->
		console.debug @name, 'initializing', @options

		@slideshowTemplate = _.template (@$ '#slideshow-template').html()
		@singleTemplate    = _.template (@$ '#single-template').html()

		@$gmap = @$ '#map-canvas'

		if @options.model
			@model = @options.model
			@populateDOM()
		else
			href = document.URL
			id = href.substr(href.lastIndexOf('/') + 1)
			model = app.models.classified
			savedClassified = window.data.classified

			if savedClassified and savedClassified._id is id
				@model = new model window.data.classified
				@populateDOM()
			else
				self = @
				@model = new model
				@model.id = id
				@listenToOnce @model, 'sync', @populateDOM
				@model.fetch()
		# this.displayMessage();

		# Render the classified only if it's not banned or archived
		# if(this.classified.status != 3 && this.classified.status != 4) {
		# 	this.render();
		# }


	continue: ->
		console.log @name, 'continue'

		@$el.fadeIn()
		@populateDOM()


	populateDOM: ->
		self = @

		# Add the main template
		($ '.c-content').html @singleTemplate @model.toJSON()

		# Add the image templates
		images = @model.get 'images'
		(@$ '.c-gallery').hide()
		if images and images.length > 0
			(@$ '.c-gallery').html @slideshowTemplate images: images
			(@$ '.c-gallery').show()

		(@$ '.page').css 'min-height', ($ window).height()

		# Render google maps
		init = -> self.initializeGoogleMaps()
		if not window.gmapInitialized
			window.gmapInitializeListeners.push init
		else init()
		# this.renderAdminbar();


	# Display a message based on the classified's status.
	displayMessage: ->
		# Parse the URL and give out the appropriate message based on it.
		getParam = app.helpers.url.getParam
		if getParam 'error' then app.error @messages[getParam 'error']
		if getParam 'success' then app.success @messages[getParam 'success']
		if getParam 'warn' then app.warn @messages[getParam 'warn']

		classified = @model.toJSON()

		if classified.guest and classified.status == 0
			app.warn 'This classified was posted anonymously and is yet to be reviewed'
		else if !classified.editable and classified.status == 0
			app.warn 'Your classified is yet to be reviewed'
		else if classified.status == 0
			app.warn 'This classified is yet to be reviewed'


		switch classified.status
			when 2
				app.error @messages.rejected, ''
				app.error classified.adminReason, 'Reason:'
			when 3
				app.error @messages.archived, 'Archived!'
			when 4
				app.error @messages.banned, ''
				app.error classified.adminReason, 'Reason:'
			when 5
				app.error 'This classified has been reported too many times and is under review', ''


	# Initializes Google maps if required.
	initializeGoogleMaps: ->
		self = @

		# Initializes the map with the latitude and longitude given
		init = (lat, lng) ->
			myLatlng = new google.maps.LatLng lat, lng
			mapOptions =
				center: myLatlng
				mapTypeControl: false
				mapTypeId: google.maps.MapTypeId.ROADMAP
				scrollwheel: false
				zoom: 13

			# Add the map
			self.gmap = new google.maps.Map self.$gmap[0], mapOptions

			# Add the marker
			self.gmarker = new google.maps.Marker
				position: myLatlng
				map: self.gmap

		@$gmap = @$ '#map-canvas'


		# If there are google co-ordinates saved, load up google maps
		meta = @model.get 'meta'
		if meta and meta.gmapX and meta.gmapY then init meta.gmapX, meta.gmapY
		else  @$gmap.hide()


	renderAdminbar: ->
		adminTemplate = _.template(@$el.find('#admin-template').html())

		# Add the admin template
		@$el.find('#admin-single').html adminTemplate classified