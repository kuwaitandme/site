window.scripts = [
  {
    name: "library:normalize-css"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/css/normalize.min.css"
    localSrc: "/stylesheets/vendor/normalize.min.css"
  }
  {
    name: "library:foundation-css"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/css/foundation.min.css"
    localSrc: "/stylesheets/vendor/foundation.min.css"
  }
  {
    name: "library:jquery.magnific-popup-css"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.0.0/magnific-popup.min.css"
    localSrc: "/stylesheets/vendor/magnific-popup.min.css"
  }
  {
    name: "app:style-css"
    remoteSrc: "/stylesheets/build/style.css?m=#{config.magic.application}"
    localSrc: "/stylesheets/build/style.css?m=#{config.magic.application}"
  }
  {
    name: "library:jquery"
    remoteSrc: "//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"
    localSrc: "/javascripts/vendor/jquery.min.js"
  }
  {
    name: "library:jquery-transit"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/jquery.transit/0.9.12/jquery.transit.min.js"
    localSrc: "/javascripts/vendor/jquery.transit.min.js"
  }
  {
    name: "library:underscore"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"
    localSrc: "/javascripts/vendor/underscore.min.js"
  }
  {
    name: "library:backbone"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"
    localSrc: "/javascripts/vendor/backbone.min.js"
  }
  {
    name: "library:google-maps"
    remoteSrc: "//maps.googleapis.com/maps/api/js?key=AIzaSyBUcoOW5jw2GvlFQI49FIGl6I7czXcX5iQ&callback=initializeGmap"
  }
  # {
  #   name: "library:facebook"
  #   remoteSrc: "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=398935173623108"
  # }
  {
    name: "library:dropzone"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/dropzone/4.0.1/min/dropzone.min.js"
    localSrc: "/javascripts/vendor/dropzone.min.js"
  }
  {
    name: "library:masonry"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/masonry/3.2.2/masonry.pkgd.min.js"
    localSrc: "/javascripts/vendor/masonry.pkgd.min.js"
  }
  {
    name: "library:foundation-js"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/js/foundation.min.js"
    localSrc: "/javascripts/vendor/foundation.min.js"
  }
  {
    name: "library:magnific-popup"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.0.0/jquery.magnific-popup.min.js"
    localSrc: "/javascripts/vendor/jquery.magnific-popup.min.js"
  }
  {
    name: "app:template"
    remoteSrc: "/javascripts/build/template.js?m=#{config.magic.application}"
    localSrc: "/javascripts/build/template.js?m=#{config.magic.application}"
  }
  {
    name: "app:script"
    remoteSrc: "/javascripts/build/app.js?m=#{config.magic.application}"
    localSrc: "/javascripts/build/app.js?m=#{config.magic.application}"
  }
]

# ### Special functions and variables to facilitate gmaps #
# window.gmapInitialized = false
# window.gmapInitializeListeners = []

window.initializeGmap = ->

head = document.getElementsByTagName("head")[0]
production = config.mode == "production"
for script in scripts
  $fileref = undefined
  foundInCache = false
  isCSS = (script.name.substr -3) == "css"

  # First prepare the element that is going to contain/request for the
  # CSS or JS
  if isCSS
    $fileref = document.createElement "link"
    $fileref.rel = "stylesheet"
  else
    $fileref = document.createElement "script"
    $fileref.type = "text/javascript"


  # If HTML5 localStorage is supported, attempt to load the scripts from
  # the application cache
  if localStorage? and production and script.localSrc
    appChanged = (localStorage.getItem "magic:application") != config.magic.application
    libraryChanged = (localStorage.getItem "magic:library") != config.magic.library

    # Note that the goal of these conditions is to ensure that app files are
    # compared with their version, but if the library versions differ then
    # we ignore the app files too.
    isLibrary = (script.name.split ":")[0] is "library"
    localVersionString = if isLibrary then "magic:library" else "magic:application"
    remoteVersionString = if isLibrary then "library" else "application"

    # Check if local and remote version of the libraries differ
    localVersion = String localStorage.getItem localVersionString
    remoteVersion = String window.config.magic[remoteVersionString]

    # Check for the script in our cache
    scriptCache = localStorage.getItem script.name

    # If versions differ, then don"t load from cache and instead load
    # the sc*ript normally. The app will eventually clear out the cache
    # and update the local version
    if libraryChanged or (appChanged and not isLibrary)
      console.log "skipping:", script.name
      scriptCache = null

    # If the cache exists, then read from it; Otherwise set a flag to
    # that will upload the script normally.
    if scriptCache
      console.log "fething from cache:", script.name

      # IMPORTANT: CSS code should be placed in the "<style></style>"
      # tag and not inside "<link/>". Which is why it is crucial to
      # not to forget that $fileref has to replaced as a new
      # element.
      if isCSS
        $fileref = document.createElement "style"
        $fileref.type = "text/css"

      # Populate the element with our cached code and set a flag to
      # notify the rest of our code that we found the cached content
      $fileref.innerHTML = scriptCache
      foundInCache = true

  # If the script was not found in cache then prepare it to be loaded
  # by the browser
  if not production then script.remoteSrc = script.localSrc or script.remoteSrc
  if not foundInCache
    $fileref.async = false
    if isCSS then $fileref.href = script.remoteSrc
    else $fileref.src = script.remoteSrc

  # Finally with whatever element we have created, insert it into the body
  if isCSS
    head.appendChild $fileref
  else
    head.insertBefore $fileref, head.firstChild
    # head.removeChild $fileref