module.exports = Backbone.View.extend

  name: '[view:classified-post:maps]'
  template: template['classified/post/maps']

  start: (options) ->
    @$gmap  = @$ '#map-canvas'
    @$gmapX = @$ '#gmapX'
    @$gmapY = @$ '#gmapY'

    @setDOM()

  continue: ->

    # Delete the map if any
    @gmap = null
    GoogleMaps = new @resources.external.GoogleMaps
    GoogleMaps.onLoad => @initializeGoogleMaps


  setModel: ->
    @model.set
      meta:
        gmapX: @$gmapX.val()
        gmapY: @$gmapY.val()


  setDOM: ->
    @$gmapX.val (@model.get 'meta').gmapX
    @$gmapY.val (@model.get 'meta').gmapY


  initializeGoogleMaps: ->
    X = @$gmapX.val() or 29.27985
    Y = @$gmapY.val() or 47.98448

    # The default co-ordinates to which we will center the map
    myLatlng = new (google.maps.LatLng)(X, Y)

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
    google.maps.event.addListener @gmarker, 'dragend', (event) =>
      # Center the map on the position of the marker
      latLng = @gmarker.getPosition()

      @gmap.setCenter latLng

      @model.set
        meta:
          gmapX: latLng.lat()
          gmapY: latLng.lng()
      # # Set our hidden input fields so that the backend can catch the
      # # co-ordinates
      # self.$gmapX.val latLng.lat()
      # self.$gmapY.val latLng.lng()