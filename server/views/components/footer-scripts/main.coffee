# Here are the scripts that get loaded during runtime. You must list the
# scripts here in the order they should be loaded. The app's localStorage
# will make sure that they get cached properly.
window.scripts = [
  {
    name: 'lib:normalize-css'
    remoteSrc: '/stylesheets/vendor/normalize.min.css'
    localSrc: '/stylesheets/vendor/normalize.min.css'
  }
  {
    name: 'lib:foundation-css'
    remoteSrc: '/stylesheets/vendor/foundation.min.css'
    localSrc: '/stylesheets/vendor/foundation.min.css'
  }
  {
    name: 'lib:card-css'
    remoteSrc: '/stylesheets/vendor/card.min.css'
    localSrc: '/stylesheets/vendor/card.min.css'
  }
  {
    name: 'app:stylesheet'
    remoteSrc: '/stylesheets/build/style.css'
    localSrc: '/stylesheets/build/style.css'
  }
  {
    name: 'lib:jquery'
    remoteSrc: '/javascripts/vendor/jquery.min.js'
    localSrc: '/javascripts/vendor/jquery.min.js'
  }
  {
    name: 'lib:jquery-transit'
    remoteSrc: '/javascripts/vendor/jquery.transit.min.js'
    localSrc: '/javascripts/vendor/jquery.transit.min.js'
  }
  {
    name: 'lib:underscore'
    remoteSrc: '/javascripts/vendor/underscore.min.js'
    localSrc: '/javascripts/vendor/underscore.min.js'
  }
  {
    name: 'lib:backbone'
    remoteSrc: '/javascripts/vendor/backbone.min.js'
    localSrc: '/javascripts/vendor/backbone.min.js'
  }
  {
    name: 'lib:modernizr'
    remoteSrc: '/javascripts/vendor/modernizr.min.js'
    localSrc: '/javascripts/vendor/modernizr.min.js'
  }
  {
    name: 'lib:dropzone'
    remoteSrc: '/javascripts/vendor/dropzone.min.js'
    localSrc: '/javascripts/vendor/dropzone.min.js'
  }
  {
    name: 'lib:masonry'
    remoteSrc: '/javascripts/vendor/masonry.pkgd.min.js'
    localSrc: '/javascripts/vendor/masonry.pkgd.min.js'
  }
  {
    name: 'lib:foundation-js'
    remoteSrc: '/javascripts/vendor/foundation.min.js'
    localSrc: '/javascripts/vendor/foundation.min.js'
  }
  {
    name: 'app:template'
    remoteSrc: '/javascripts/build/template.js'
    localSrc: '/javascripts/build/template.js'
  }
  {
    name: 'app:script'
    remoteSrc: '/javascripts/build/app.js'
    localSrc: '/javascripts/build/app.js'
  }
  {
    name: 'lib:card-js'
    remoteSrc: '/javascripts/vendor/card.min.js'
    localSrc: '/javascripts/vendor/card.min.js'
  }
  {
    name: 'lib:2co-js'
    remoteSrc: '/javascripts/vendor/2co.min.js'
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
  if localStorage? and false

    # Check if local and remote version of the libraries differ
    localVersion = String localStorage.getItem 'ver:library'
    remoteVersion = String window.config.js.libraryVersion

    # Check for the script in our cache
    scriptCache = localStorage.getItem(script.name)

    # If versions differ, then don't load from cache and instead load
    # the script normally. The app will eventually clear out the cache
    # and update the local version
    if localVersion is not remoteVersion then scriptCache = null

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