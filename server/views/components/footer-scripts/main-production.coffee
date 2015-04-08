# Here are the scripts that get loaded during runtime. You must list the
# scripts here in the order they should be loaded. The app's localStorage
# will make sure that they get cached properly.
window.scripts = [
  {
    name: 'lib:normalize-css'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/css/normalize.min.css'
    localSrc: '/stylesheets/vendor/normalize.min.css'
  }
  {
    name: 'lib:foundation-css'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/css/foundation.min.css'
    localSrc: '/stylesheets/vendor/foundation.min.css'
  }
  {
    name: 'lib:card-css'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/card/0.0.2/css/card.min.css'
    localSrc: '/stylesheets/vendor/card.min.css'
  }
  {
    name: 'app:stylesheet'
    remoteSrc: '/stylesheets/build/style.min.css'
    localSrc: '/stylesheets/build/style.min.css'
  }
  {
    name: 'lib:jquery'
    remoteSrc: '//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js'
    localSrc: '/javascripts/vendor/jquery.min.js'
  }
  {
    name: 'lib:jquery-transit'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/jquery.transit/0.9.12/jquery.transit.min.js'
    localSrc: '/javascripts/vendor/jquery.transit.min.js'
  }
  {
    name: 'lib:underscore'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js'
    localSrc: '/javascripts/vendor/underscore.min.js'
  }
  {
    name: 'lib:backbone'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js'
    localSrc: '/javascripts/vendor/backbone.min.js'
  }
  {
    name: 'lib:google-maps'
    remoteSrc: '//maps.googleapis.com/maps/api/js?v=3.exp&callback=initializeGmap'
    localSrc: '/javascripts/vendor/google.maps.min.js'
  }
  {
    name: 'lib:modernizr'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js'
    localSrc: '/javascripts/vendor/modernizr.min.js'
  }
  {
    name: 'lib:dropzone'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/dropzone/4.0.1/min/dropzone.min.js'
    localSrc: '/javascripts/vendor/dropzone.min.js'
  }
  {
    name: 'lib:masonry'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/masonry/3.2.2/masonry.pkgd.min.js'
    localSrc: '/javascripts/vendor/masonry.pkgd.min.js'
  }
  {
    name: 'lib:jquery-imagesloaded'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.1.8/imagesloaded.pkgd.min.js'
    localSrc: '/javascripts/vendor/imagesloaded.min.js'
  }
  {
    name: 'lib:foundation-js'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/js/foundation.min.js'
    localSrc: '/javascripts/vendor/foundation.min.js'
  }
  {
    name: 'app:template'
    remoteSrc: '/javascripts/build/template.min.js'
    localSrc: '/javascripts/build/template.min.js'
  }
  {
    name: 'app:script'
    remoteSrc: '/javascripts/build/app.min.js'
    localSrc: '/javascripts/build/app.min.js'
  }
  {
    name: 'lib:card-js'
    remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/card/0.0.2/js/card.min.js'
    localSrc: '/javascripts/vendor/card.min.js'
  }
  {
    name: 'lib:2co-js'
    remoteSrc: '//www.2checkout.com/checkout/api/2co.min.js'
    localSrc: '/javascripts/vendor/2co.min.js'
  }
]

### Special functions and variables to facilitate gmaps ###

window.gmapInitialized = false
window.gmapInitializeListeners = []

window.initializeGmap = ->
  window.gmapInitialized = true
  listeners = window.gmapInitializeListeners
  i = 0
  while i < listeners.length
    listeners[i]()
    i++
  return

head = document.getElementsByTagName('head')[0]
i = scripts.length
# while i >= 1
for script in scripts
  # script = scripts[scripts.length - i]
  $fileref = undefined
  foundInCache = false
  isCSS = script.remoteSrc.substr(-3) == 'css'

  # First prepare the element that is going to contain/request for the
  # CSS or JS
  if isCSS
    $fileref = document.createElement 'link'
    $fileref.rel = 'stylesheet'
  else
    $fileref = document.createElement 'script'

  # If HTML5 localStorage is supported, attempt to load the scripts from
  # the application cache
  if localStorage?
    appChanged = (localStorage.getItem 'version:application') != window.config.js.applicationVersion
    libraryChanged = (localStorage.getItem 'version:library') != window.config.js.libraryVersion

    # Note that the goal of these conditions is to ensure that app files are
    # compared with their version, but if the library versions differ then
    # we ignore the app files too.
    isLibrary = (script.name.split ':')[0] is 'library'
    localVersionString = if isLibrary then 'version:library' else 'version:application'
    remoteVersionString = if isLibrary then 'libraryVersion' else 'applicationVersion'

    # Check if local and remote version of the libraries differ
    localVersion = String localStorage.getItem localVersionString
    remoteVersion = String window.config.js[remoteVersionString]

    # Check for the script in our cache
    scriptCache = localStorage.getItem script.name

    # If versions differ, then don't load from cache and instead load
    # the script normally. The app will eventually clear out the cache
    # and update the local version
    if libraryChanged or (appChanged and not isLibrary)
      console.log 'skipping', script.name
      scriptCache = null

    # If the cache exists, then read from it; Otherwise set a flag to
    # that will upload the script normally.
    if scriptCache

      # IMPORTANT: CSS code should be placed in the '<style></style>'
      # tag and not inside '<link/>'. Which is why it is crucial to
      # not to forget that $fileref has to replaced as a new
      # element.
      if isCSS
        $fileref = document.createElement('style')
        $fileref.type = 'text/css'

      # Populate the element with our cached code and set a flag to
      # notify the rest of our code that we found the cached content
      $fileref.innerHTML = scriptCache
      foundInCache = true

  # If the script was not found in cache then prepare it to be loaded
  # by the browser
  if not foundInCache
    $fileref.async = false # <-- this is important
    if isCSS
      $fileref.href = script.remoteSrc
    else
      $fileref.src = script.remoteSrc

  # Finally with whatever element we have created, insert it into the body
  if isCSS
    head.appendChild $fileref
  else
    $fileref.type = 'text/javascript'
    head.insertBefore $fileref, head.firstChild
    head.removeChild $fileref