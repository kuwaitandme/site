module.exports = Backbone.View.extend
  name: '[view:classified-post:maps]'
  template: template['classified/post/maps']

  events: "click #maps-disabled-overlay" : "enableMaps"

  start: (options) ->
    @$gmap  = @$ '#map-canvas'
    @$gmapX = @$ '#gmapX'
    @$gmapY = @$ '#gmapY'

    @$mapContainer = @$ "#maps-container"
    @$mapDisableOverlay = @$ "#maps-disabled-overlay"

    @$mapContainer.css 'max-height', ($ window).height()/2

    @setDOM()

  continue: ->
    if not @gmap?
      GoogleMaps = new @resources.external.GoogleMaps
      GoogleMaps.onLoad => @initializeGoogleMaps()


  enableMaps: ->
    @$mapDisableOverlay.hide()


  setModel: ->
    if @$gmapX.val() or @$gmapY.val()
      meta = (@model.get 'meta') or {}
      meta.gmapX = @$gmapX.val()
      meta.gmapY = @$gmapY.val()
      @model.set 'meta', meta


  setDOM: ->
    @$gmapX.val (@model.get 'meta').gmapX
    @$gmapY.val (@model.get 'meta').gmapY


  initializeGoogleMaps: ->
    X = @$gmapX.val() or 29.375770981110353
    Y = @$gmapY.val() or 47.98656463623047

    # The default co-ordinates to which we will center the map
    myLatlng = new google.maps.LatLng X, Y

    # Initialize the map
    @gmap = new google.maps.Map @$gmap[0],
      center: myLatlng
      mapTypeControl: false
      mapTypeId: google.maps.MapTypeId.ROADMAP
      scrollwheel: false
      zoom: 13

    # Initialize the marker
    @gmarker = new google.maps.Marker
      draggable: true
      map: @gmap
      position: myLatlng

    google.maps.event.addListener @gmap, 'click', (event) =>
      latitude = event.latLng.lat()
      longitude = event.latLng.lng()
      latLng = new google.maps.LatLng latitude, longitude

      @$gmapX.val latLng.lat()
      @$gmapY.val latLng.lng()

      @gmarker.setPosition latLng
      @gmap.panTo latLng

    # Add a listener to center the map on the marker whenever th
    # marker has been dragged
    google.maps.event.addListener @gmarker, 'dragend', (event) =>
      # Center the map on the position of the marker
      latLng = @gmarker.getPosition()

      @gmap.panTo latLng

      @$gmapX.val latLng.lat()
      @$gmapY.val latLng.lng()