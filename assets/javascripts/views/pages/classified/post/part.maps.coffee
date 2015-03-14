module.exports = Backbone.View.extend

	initialize: (options) ->
		@model = options.model
		if options.$el then	@$el = options.$el

		@$gmap  = @$ '#map-canvas'
		@$gmapX = @$ '#gmapX'
		@$gmapY = @$ '#gmapY'

		@on "close", @close


	render: -> @initMaps()


	setModel: ->
		@model.set meta:
			gmapX: @$gmapX.val()
			gmapY: @$gmapY.val()


	# Initializes Google maps
	initMaps: ->
		# The default co-ordinates to which we will center the map
		myLatlng = new (google.maps.LatLng)(29.27985, 47.98448)

		# Initialize the map
		@gmap = new (google.maps.Map)(@$gmap[0],
			center: myLatlng
			mapTypeControl: false
			mapTypeId: google.maps.MapTypeId.ROADMAP
			scrollwheel: false
			zoom: 13)

		# Initialize the marker
		@gmarker = new (google.maps.Marker)(
			draggable: true
			map: @gmap
			position: myLatlng)

		# Add a listener to center the map on the marker whenever th
		# marker has been dragged
		google.maps.event.addListener @gmarker, 'dragend', (event) ->
			# Center the map on the position of the marker
			latLng = @gmarker.getPosition()
			@gmap.setCenter latLng

			# Set our hidden input fields so that thethis. backend can catch
			# it
			@$gmapX.val latLng.lat()
			@$gmapY.val latLng.lng()


	close: ->
		@remove()
		@unbind()
		@stopListening()