window.scripts = [
  {
    name: "app:style-css"
    remoteSrc: "/stylesheets/style.css?m=#{publicData.magic.application}"
    localSrc: "/stylesheets/style.css?m=#{publicData.magic.application}"
  }
  {
    name: "library:masonry"
    remoteSrc: "/javascripts/libraries.js"
  }
  {
    name: "app:template"
    remoteSrc: "/javascripts/templates.js?m=#{publicData.magic.application}"
    localSrc:  "/javascripts/templates.js?m=#{publicData.magic.application}"
  }
  {
    name: "app:script"
    remoteSrc: "/javascripts/app.js?m=#{publicData.magic.application}"
    localSrc:  "/javascripts/app.js?m=#{publicData.magic.application}"
  }
  {
    name: "library:google-maps"
    remoteSrc: "//maps.googleapis.com/maps/api/js?key=AIzaSyBUcoOW5jw2GvlFQI49FIGl6I7czXcX5iQ&callback=initializeGmap"
  }
  {
    name: "library:font-opensans-css"
    remoteSrc: "//fonts.googleapis.com/css?family=Open+Sans:400,600"
  }
  {
    name: "library:font-roboto-css"
    remoteSrc: "//fonts.googleapis.com/css?family=Roboto"
  }
  {
    name: "library:font-bitter-css"
    remoteSrc: "//fonts.googleapis.com/css?family=Bitter"
  }
  {
    name: "library:font-awesome-css"
    remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css"
  }
]

window.initializeGmap = ->

totalScriptsLoaded = 0
(document.getElementsByTagName 'body')[0].className += 'page-loading'
incrementProgressBar = ->
  setProgressBar = (i, total) ->
    progressBarStyle = document.getElementById("page-loading-bar").style
    progressBarStyle.width = "#{i * 1.0 / total * 100}%"
  totalScriptsLoaded++
  setProgressBar totalScriptsLoaded, window.scripts.length


head = document.getElementsByTagName("head")[0]
production = publicData.environment == "production"
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
  $fileref.onreadystatechange = ->
    if @readyState is "complete" then incrementProgressBar();
  $fileref.onload = incrementProgressBar


  # If HTML5 localStorage is supported, attempt to load the scripts from
  # the application cache
  if localStorage? and production and script.localSrc
    appChanged = (localStorage.getItem "magic:application") != publicData.magic.application
    libraryChanged = (localStorage.getItem "magic:library") != publicData.magic.library

    # Note that the goal of these conditions is to ensure that app files are
    # compared with their version, but if the library versions differ then
    # we ignore the app files too.
    isLibrary = (script.name.split ":")[0] is "library"
    localVersionString = if isLibrary then "magic:library" else "magic:application"
    remoteVersionString = if isLibrary then "library" else "application"

    # Check if local and remote version of the libraries differ
    localVersion = String localStorage.getItem localVersionString
    remoteVersion = String window.publicData.magic[remoteVersionString]

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
      console.log "fetching from cache:", script.name

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
  if isCSS then head.appendChild $fileref
  else head.insertBefore $fileref, head.firstChild