###*
 *
 *
 * @author Steven Enamakel <me@steven.pw>
###
u = publicData.staticUrl


# Set this to the total number of scripts in the page. Ideally we could use a
# loop and find out programatically, but I prefer to hard-code it as the
# dependencies don't change that often.
maxScriptCount = 13

window.scripts = [
  {
    id: "style.css"
    remote: ["#{u}/build/md5/style_#{publicData.md5['style.css']}.css"]
    local: "/build/md5/style_#{publicData.md5['style.css']}.css"
  }
  {
    id: "libraries.js"
    remote: [
      "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/angular-hotkeys/1.4.5/hotkeys.min.js"
      # "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-cookies.min.js"
      # "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-sanitize.min.js"
      "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-touch.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.14/angular-ui-router.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/masonry/3.3.0/masonry.pkgd.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/angular-md5/0.1.7/angular-md5.min.js"
      # "//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io.min.js"
    ]
    local: "/build/md5/libraries_#{ publicData.md5['libraries.js'] }.js"
  }
  {
    id: "templates.js"
    remote: ["#{u}/build/md5/templates_#{publicData.md5['templates.js']}.js"]
    local: "/build/md5/templates_#{publicData.md5['templates.js']}.js"
  }
  {
    id: "common.js"
    remote: ["#{u}/build/md5/common_#{publicData.md5['common.js']}.js"]
    local: "/build/md5/common_#{publicData.md5['common.js']}.js"
  }
  {
    id: "news.js"
    remote: ["#{u}/build/md5/news_#{publicData.md5['news.js']}.js"]
    local: "/build/md5/news_#{publicData.md5['news.js']}.js"
  }
  {
    id: "fonts.css"
    remote: [
      "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css"
      "//fonts.googleapis.com/css?family=Cantarell"
      "//fonts.googleapis.com/css?family=Open+Sans:400,600"
      "//fonts.googleapis.com/css?family=Roboto"
      "//fonts.googleapis.com/css?family=Roboto+Slab"
      "//fonts.googleapis.com/css?family=Palanquin:100"
      "//fonts.googleapis.com/css?family=Droid+Sans:700"
    ]
  }
]


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
 *
 * @param {[type]} [varname] [description]
 * @param {[type]} [varname] [description]
 * @param {[type]} [varname] [description]
###
_addScript = (urlsOrCode, isCSS, isCode) ->
  if isCSS
    # IMPORTANT: CSS code should be placed in the "<style></style>"
    # tag and not inside "<link/>".
    if isCode then $fileref = document.createElement "style"
    else $fileref = document.createElement "link"
    $fileref.rel = "stylesheet"
    $fileref.type = "text/css"

    # This line is sort-of a hack to make the CSS page non-render blocking.
    # We must make sure that when the stylesheet is loaded fully, we must
    # replace this attribute with the standard 'all' otherwise the browser won't
    # apply the CSS.
    #
    # This media tag is used to match different devices. Setting it to none
    # makes it not match any device and causes the browser to truely load in
    # async.
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
    if @readyState is "complete" then incrementProgressBar()
  $fileref.onload = ->
    if this.media is "none" then this.media = "all"
    incrementProgressBar()

  # Finally with whatever element we have created, insert it into the body
  if isCSS then head.appendChild $fileref
  else head.insertBefore $fileref, head.firstChild


###*
 * This function processes the given script and attempts to load it either from
 * the cache or from the remote URL..
 *
 * @param {[type]} [varname] [description]
###
processScript = (script) ->
  isCode = false
  isCSS = (script.id.substr -3) == "css"
  urlsOrCode = script.remote

  # If HTML5 localStorage is supported, attempt to load the scripts from
  # the application cache. If we are in development mode then don't load from
  # the cache at all!
  if Storage? and script.local? and not isDevelopment
    cacheID = "script:#{script.id}"
    md5ID = "md5:#{script.id}"

    # Check if local and remote version of the libraries differ
    localVersion = String localStorage.getItem md5ID
    remoteVersion = String window.publicData.md5[script.id]

    # Check for the script in our cache
    scriptCache = localStorage.getItem cacheID

    # If versions differ, then don't load from cache and instead load
    # the script normally. The frontend App will eventually clear out the cache
    # and update it with the new version.
    if localVersion != remoteVersion or localVersion is "null"
      console.log "avoiding #{script.id} from cache"
      scriptCache = null

    # If the cache exists, then read from it and set a flag to let our
    # helper functions know to that we are sending it raw code..
    if scriptCache
      console.log "fetching from cache:", script.id
      urlsOrCode = [scriptCache]
      isCode = true

  # If we are in development mode, then we simply load the local scripts
  # to avoid delays from the remote servers.
  if isDevelopment and not isCode and script.local?
    urlsOrCode = [script.local]

  # Finally!! load the processed script into the DOM.
  _addScript urlOrCode, isCSS, isCode for urlOrCode in urlsOrCode


# Now that all our helper functions have been defined, we start processing each
# script one-by-one..
processScript script for script in scripts
