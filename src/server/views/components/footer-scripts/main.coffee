u = publicData.staticUrl

###
  Set this to the total number of scripts in the page. Ideally we could use a
  loop and find out programatically, but I prefer to hard-code it as the
  dependencies don't change that often.
###
maxScriptCount = 11

window.scripts = [
  {
    id: "app:style-css"
    remote: ["#{u}/build/md5/style_#{publicData.magic['style.css']}.css"]
    local: "/build/md5/style_#{publicData.magic['style.css']}.css"
  }
  {
    id: "library"
    remote: [
      "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/angular-hotkeys/1.4.5/hotkeys.min.js"
      # "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-cookies.min.js"
      # "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-sanitize.min.js"
      "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-touch.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.14/angular-ui-router.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/masonry/3.3.0/masonry.pkgd.min.js"
    ]
    local: "/build/md5/libraries_#{ publicData.magic['libraries.js'] }.js"
  }
  {
    id: "app:template"
    remote: ["#{u}/build/md5/templates_#{publicData.magic['templates.js']}.js"]
    local: "/build/md5/templates_#{publicData.magic['templates.js']}.js"
  }
  {
    id: "app:script"
    remote: ["#{u}/build/md5/app_#{publicData.magic['app.js']}.js"]
    local: "/build/md5/app_#{publicData.magic['app.js']}.js"
  }
  {
    id: "library:font-css"
    remote: [
      "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css"
      "//fonts.googleapis.com/css?family=Cantarell"
      "//fonts.googleapis.com/css?family=Open+Sans:400,600"
      "//fonts.googleapis.com/css?family=Roboto"
      "//fonts.googleapis.com/css?family=Roboto+Slab"
    ]
  }
]

# Defining this function for some reason fixes the google maps API from not
# loading. This function is set as the callback fn. in the maps's URL.
window.initializeGmap = ->

# Define some variables
head = (document.getElementsByTagName "head")[0]
body = (document.getElementsByTagName "body")[0]
totalScriptsLoaded = 0
isDevelopment = publicData.environment == "development"

# Create this helper function to automatically increment the progress bar.
incrementProgressBar = ->
  setProgressBar = (i, total) ->
    progressBarStyle = (document.getElementById "page-loading-bar").style
    progressBarStyle.width = "#{i * 1.0 / total * 100}%"
  totalScriptsLoaded++
  setProgressBar totalScriptsLoaded, maxScriptCount

###*
 * This function neatly adds the script/stylesheet into the DOM, and that too
 * asynchronously. It also takes care of making sure that CSS code is loaded in
 * a non-blocking manner (This means that you need to make sure that you have
 * some inline styles on the page otherwise the page will look ugly when the
 * CSS has not yet fully loaded. See more about render-blocking CSS).
###
_addScript = (urlsOrCode, isCSS, isCode) ->
  if isCSS
    # IMPORTANT: CSS code should be placed in the "<style></style>"
    # tag and not inside "<link/>".
    if isCode then $fileref = document.createElement "style"
    else $fileref = document.createElement "link"
    $fileref.rel = "stylesheet"
    $fileref.type = "text/css"
    ###
      This line is sort-of a hack to make the CSS page non-render blocking.
      We must make sure that when the stylesheet is loaded fully, we must
      replace this attribute with the standard 'all' otherwise the browser won't
      apply the CSS.

      This media tag is used to match different devices. Setting it to none
      makes it not match any device and causes the browser to truely load in
      async.
    ###
    $fileref.media = "none"
  else
    $fileref = document.createElement "script"
    $fileref.type = "text/javascript"
  # Populate the element with our cached code
  if isCode
    # This line makes sure that our render-blocking hack is reverted..
    $fileref.media = "all"
    $fileref.innerHTML = urlsOrCode
  else # Load the script from the URL
    if isCSS then $fileref.href = urlsOrCode
    else $fileref.src = urlsOrCode
  $fileref.async = false
  # Setup our listeners for when the script/css has been inserted
  $fileref.onreadystatechange = ->
    if this.media is "none" then this.media = "all"
    if @readyState is "complete" then incrementProgressBar();
  $fileref.onload = ->
    if this.media is "none" then this.media = "all"
    incrementProgressBar()
  # Finally with whatever element we have created, insert it into the body
  if isCSS then head.appendChild $fileref
  else head.insertBefore $fileref, head.firstChild


###*
 * This function processes the given script and attempts to load it either from
 * the cache or from the remote URL..
###
processScript = (script) ->
  isCode = false
  isCSS = (script.id.substr -3) == "css"
  urlsOrCode = script.remote
  # If HTML5 localStorage is supported, attempt to load the scripts from
  # the application cache. If we are in development mode then don't load from
  # the cache at all!
  if Storage? and script.local? and not isDevelopment
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
    # the script normally. The frontend App will eventually clear out the cache
    # and update it with the new version.
    if libraryChanged or (appChanged and not isLibrary)
      console.log "skipping:", script.id
      scriptCache = null
    # If the cache exists, then read from it and set a flag to let our
    # helper functions know to that we are sending it raw code..
    if scriptCache
      console.log "fetching from cache:", script.id
      urlsOrCode = [scriptCache]
      isCode = true
  # If we are in development mode, then we simply load the local scripts
  # to avoid delays from the remote servers.
  if isDevelopment and script.local? then urlsOrCode = [script.local]
  # Finally!! load the processed script into the DOM.
  _addScript urlOrCode, isCSS, isCode for urlOrCode in urlsOrCode

# Now that all our helper functions have been defined, we start processing each
# script one-by-one..
processScript script for script in scripts
