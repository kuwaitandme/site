url    = (require 'app-helpers').url
view   = require '../../mainView'

module.exports = view.extend
	name: "[view:classified-single]"
	messages:
		archived:  'This classified has been deleted'
		banned:    'This classified has been banned by a moderator'
		needlogin: 'You need to be logged in to make such requests'
		notfound:  'Classified was not found'
		rejected:  'This classified has been rejected by a moderator'
		reported:  'Your report has been successfully submitted'
		unpriv:    'You are not allowed to make such bogus requests'


	events: "submit form" : "submitHandle"

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
			(@$ '.c-gallery').show().html @slideshowTemplate images: images

		(@$ '.page').css 'min-height', ($ window).height()

		# Render google maps
		init = -> self.initializeGoogleMaps()
		if not window.gmapInitialized
			window.gmapInitializeListeners.push init
		else init()
		# window.a = @model
		@renderAdminbar()


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


	submitHandle: (event) ->
		console.log @name, 'reading submit event'

		event.preventDefault()
		$form = $ event.currentTarget
		action = ($form.find "[name='action']").val()
		reason = ($form.find "[name='reason']").val()

		switch action
			when 'publish' then @model.set 'status', @model.status.ACTIVE
			when 'archive' then @model.set 'status', @model.status.ARCHIVED
			when 'repost'
				if @model.get 'guest'
					@model.set 'status', @model.status.INACTIVE
				else
					@model.set 'status', @model.status.ACTIVE
			when 'ban'
				@model.set 'status', @model.status.BANNED
				@model.set 'adminReason', reason
			when 'reject'
				@model.set 'status', @model.status.REJECTED
				@model.set 'adminReason', reason
			when 'report'
				reports = _.clone @model.get 'reports'
				reports.push reason
				@model.unset "reports", silent: true
				@model.set "reports", reports

		if @model.hasChanged()
			@model.save @model.changedAttributes(), {patch: true}


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
		adminTemplate = _.template (@$ '#admin-template').html()

		user = app.models.currentUser
		if user.get 'isAdmin' then superEditable = true
		if user.id is @model.get 'owner' then editable = true

		if @model.get 'guest'
			editable = false
			# if @model.get
		superEditable = true
		if editable or superEditable
			# Add the admin template
			(@$ '#admin-single').html adminTemplate
				editable: editable
				superEditable: superEditable