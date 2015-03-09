module.exports = Backbone.View.extend
	initialize: (obj) ->
		@model = options.model
		@$gmap = @$el.find('#map-canvas')
		@$gmapX = @$el.find('#gmapX')
		@$gmapY = @$el.find('#gmapY')


	render: ->
		# Resize the pages whenever the window resizes
		$(window).resize(->
			$('.page').css 'min-height', $(window).height()
			return
		).resize()
		@$currentPage = $('#page-0')
		@$currentPage.show()
		@$currentPage.transition opacity: 1
		@$gmap.css 'min-height', $(window).height() / 3

		# Initialize parts of the form
		@initCategories()
		@initDropzone()
		@initLocations()
		@$description.redactor()
		@spinner = new (app.views.components.spinner)


	validate: -> true

	# Unlocks the map and address fields
	unlockMapAndAddress: (e) ->
		lastVal = @$locations.find('option:last-child').val()

		# Check if we selected the last option or not. If we have, then disabled
		# the map and the address fields
		if @$locations.val() != lastVal
			$('[name=\'address1\']').removeClass 'hide'
			$('[name=\'address2\']').removeClass 'hide'
			$('#page-4').removeClass 'hide'
			$('#page-4-prev, #page-4-next').attr 'href', '#page-4'
		else
			$('[name=\'address1\']').addClass 'hide'
			$('[name=\'address2\']').addClass 'hide'
			$('#page-4').addClass 'hide'
			$('#page-4-prev').attr 'href', '#page-3'
			$('#page-4-next').attr 'href', '#page-5'


	# Gets all the form data from the page, into a local variable and returns
	# it.
	getFormData: ->
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