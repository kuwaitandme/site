# Set this to the total number of scripts in the page. Ideally we could use a
# loop and find out programatically, but I prefer to hard-code it as the
# dependencies don't change that often.
#
# FIX THIS
maxScriptCount = 13

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
_addScript = (urlsOrCode, isCSS) ->
  if isCSS
    $fileref = document.createElement "link"
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

  # If we are in development mode, then we simply load the local scripts
  # to avoid delays from the remote servers.
  if isDevelopment and not isCode and script.local?
    urlsOrCode = [script.local]

  # Finally!! load the processed script into the DOM.
  _addScript urlOrCode, isCSS for urlOrCode in urlsOrCode


# Now that all our helper functions have been defined, we start processing each
# script one-by-one..
processScript script for script in scripts