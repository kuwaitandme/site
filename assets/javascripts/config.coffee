###
Configuration
-------------

This file contains settings for the different components of the App. Any
changes here will effect the behavior of the App.

###
module.exports =
  ###
  ## jsVersion:
  This controls the version of the different JS components that are stored in the HTML5
  local-storage as cache.
  ###
  jsVersion: window.jsVersion

  ###
  ## hostname:
  This variable is used to prefix the URL for all AJAX requests. This is useful
  if we are deploying this App in phonegap and when we need to make CORS
  requests
  ###
  hostname: ""

  ###
  ## localStorage:

  ###
  localStorage:
    enabled: true

  ###
  ## html5Pushstate:

  ###
  html5Pushstate: true
    enabled: true