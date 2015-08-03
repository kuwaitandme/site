name = "[service:google-maps]"


exports = module.exports = ($window, $environment, $log) -> new class
  constructor: ->
    $log.log name, "initializing"
    # Prepare the URL for the maps API
    APIkey = "AIzaSyBUcoOW5jw2GvlFQI49FIGl6I7czXcX5iQ"
    url = "https://maps.googleapis.com/maps/api/js?key=#{APIkey}&callback=initializeGmap"
    $window.initializeGmap = ->
    # Insert the script into the DOM
    $fileref = document.createElement "script"
    $fileref.type = "text/javascript"
    $fileref.src = url
    head = (document.getElementsByTagName "head")[0]
    head.insertBefore $fileref, head.firstChild


  onLoad: (callback) ->
    waitForElement = ->
      if $window.google? and
        $window.google.maps? and
        $window.google.maps.Circle? then (callback or ->)()
      else setTimeout (-> waitForElement()), 250
    waitForElement()

  # https://snazzymaps.com/style/42/apple-maps-esque
  defaultStyle: [
    {
      "featureType": "landscape.man_made"
      "elementType": "geometry"
      "stylers": [ {"color": "#f7f1df"} ]
    }
    {
      "featureType": "landscape.natural"
      "elementType": "geometry"
      "stylers": [ {"color": "#d0e3b4"} ]
    }
    {
      "featureType": "landscape.natural.terrain"
      "elementType": "geometry"
      "stylers": [ {"visibility": "off"} ]
    }
    {
      "featureType": "poi"
      "elementType": "labels"
      "stylers": [ {"visibility": "off"} ]
    }
    {
      "featureType": "poi.business"
      "elementType": "all"
      "stylers": [ {"visibility": "off"} ]
    }
    {
      "featureType": "poi.medical"
      "elementType": "geometry"
      "stylers": [ {"color": "#fbd3da"} ]
    }
    {
      "featureType": "poi.park"
      "elementType": "geometry"
      "stylers": [ {"color": "#bde6ab"} ]
    }
    {
      "featureType": "road"
      "elementType": "geometry.stroke"
      "stylers": [ {"visibility": "off"} ]
    }
    {
      "featureType": "road"
      "elementType": "labels"
      "stylers": [ {"visibility": "off"} ]
    }
    {
      "featureType": "road.highway"
      "elementType": "geometry.fill"
      "stylers": [ {"color": "#ffe15f"} ]
    }
    {
      "featureType": "road.highway"
      "elementType": "geometry.stroke"
      "stylers": [ {"color": "#efd151"} ]
    }
    {
      "featureType": "road.arterial"
      "elementType": "geometry.fill"
      "stylers": [ {"color": "#ffffff"} ]
    }
    {
      "featureType": "road.local"
      "elementType": "geometry.fill"
      "stylers": [ {"color": "black"} ]
    }
    {
      "featureType": "transit.station.airport"
      "elementType": "geometry.fill"
      "stylers": [ {"color": "#cfb2db"} ]
    }
    {
      "featureType": "water"
      "elementType": "geometry"
      "stylers": [ {"color": "#a2daf2"} ]
    }
  ]


exports.$inject = [
  "$window"
  "$environment"
  "$log"
]
