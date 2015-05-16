u = publicData.staticUrl;
window.scripts = [
  {
    id: "app:style-css"
    remote: ["#{u}/stylesheets/style.css?m=#{publicData.magic.application}"]
    local: "#{u}/stylesheets/style.css?m=#{publicData.magic.application}"
  }
  {
    id: "library"
    remote: [
      "//ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.14/angular-ui-router.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/masonry/3.3.0/masonry.pkgd.min.js"
    ]
    local: "#{u}/javascripts/libraries.js"
  }
  {
    id: "app:template"
    remote: ["#{u}/javascripts/templates.js?m=#{publicData.magic.application}"]
    local:  "#{u}/javascripts/templates.js?m=#{publicData.magic.application}"
  }
  {
    id: "app:script"
    remote: ["#{u}/javascripts/app.js?m=#{publicData.magic.application}"]
    local:  "#{u}/javascripts/app.js?m=#{publicData.magic.application}"
  }
  {
    id: "library:font-opensans-css"
    remote: ["//fonts.googleapis.com/css?family=Open+Sans:400,600"]
  }
  {
    id: "library:font-roboto-css"
    remote: ["//fonts.googleapis.com/css?family=Roboto"]
  }
  {
    id: "library:font-awesome-css"
    remote: ["//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css"]
  }
]

window.initializeGmap = ->
head = (document.getElementsByTagName "head")[0]
body = (document.getElementsByTagName "body")[0]

totalScriptsLoaded = 0
incrementProgressBar = ->
  body.classid += "loading"
  setProgressBar = (i, total) ->
    progressBarStyle = (document.getElementById "page-loading-bar").style
    progressBarStyle.width = "#{i * 1.0 / total * 100}%"
  totalScriptsLoaded++
  setProgressBar totalScriptsLoaded, 8

isDevelopment = false and publicData.environment == "development"


_addScript = (urlsOrCode, isCSS, isCode) ->
  if isCSS
    # IMPORTANT: CSS code should be placed in the "<style></style>"
    # tag and not inside "<link/>". Which is why it is crucial to
    # not to forget that $fileref has to replaced as a new
    # element.
    if isCode then $fileref = document.createElement "style"
    else $fileref = document.createElement "link"
    $fileref.rel = "stylesheet"
    $fileref.type = "text/css"
  else
    $fileref = document.createElement "script"
    $fileref.type = "text/javascript"

  # Populate the element with our cached code
  if isCode then $fileref.innerHTML = urlsOrCode
  else # Load the script from the URL
    if isCSS then $fileref.href = urlsOrCode
    else $fileref.src = urlsOrCode
  $fileref.async = false

  $fileref.onreadystatechange = ->
    if @readyState is "complete" then incrementProgressBar();
  $fileref.onload = incrementProgressBar

  # Finally with whatever element we have created, insert it into the body
  if isCSS then head.appendChild $fileref
  else head.insertBefore $fileref, head.firstChild


for script in scripts
  isCode = false
  isCSS = (script.id.substr -3) == "css"
  urlsOrCode = script.remote
  # If HTML5 localStorage is supported, attempt to load the scripts from
  # the application cache
  if Storage? and script.local? #and not isDevelopment
  # if localStorage? and production and script.local
    appChanged = (localStorage.getItem "magic:application") != String publicData.magic.application
    libraryChanged = (localStorage.getItem "magic:library") != String publicData.magic.library

    # Note that the goal of these conditions is to ensure that app files are
    # compared with their version, but if the library versions differ then
    # we ignore the app files too.
    isLibrary = (script.id.split ":")[0] is "library"
    localVersionString = if isLibrary then "magic:library" else "magic:application"
    remoteVersionString = if isLibrary then "library" else "application"

    # Check if local and remote version of the libraries differ
    localVersion = String localStorage.getItem localVersionString
    remoteVersion = String window.publicData.magic[remoteVersionString]

    # Check for the script in our cache
    scriptCache = localStorage.getItem script.id

    # If versions differ, then don't load from cache and instead load
    # the script normally. The app will eventually clear out the cache
    # and update the local version
    if libraryChanged or (appChanged and not isLibrary)
      console.log "skipping:", script.id
      scriptCache = null

    # If the cache exists, then read from it; Otherwise set a flag to
    # that will upload the script normally.
    if scriptCache
      console.log "fetching from cache:", script.id
      # console.log
      urlsOrCode = [scriptCache]
      isCode = true

  if isDevelopment and script.local? then urlsOrCode = [script.local]
  _addScript urlOrCode, isCSS, isCode for urlOrCode in urlsOrCode