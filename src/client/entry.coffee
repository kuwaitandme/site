console.log "[app] initializing"
app = angular.module "App", [
  # "ngCookies"
  # "ngSanitize"
  "ngTouch"
  "ui.router"
  "cfp.hotkeys"
  # "btford.socket-io"
]


(require "./components")    app
(require "./config")        app
(require "./directives")    app
(require "./filters")       app
(require "./libraries")     app
(require "./providers")     app
(require "./run")           app
(require "./services")      app
(require "./values")        app
(require "./views")         app


# Helper function to boot the angular App.
boot = ->
  console.log "[app] bootstraping angular"
  html = (document.getElementsByTagName "html")[0]
  body = (document.getElementsByTagName "body")[0]
  body.className = body.className.replace /\initializing\b/, ''
  angular.bootstrap html, ["App"]


# Now only boot the angular app, if the JST template has been loaded. Because
# we can't determine which async script loads first and this avoids the script
# from breaking due to race conditions..
#
# http://stackoverflow.com/questions/8996852/load-and-execute-order-of-scripts
# We wait for all the dependencies to be loaded first, before executing the
# angular app itself.
#
# This recursive function will keep on checking for the JST variable to be
# defined. And when it does get defined, it will boot the app!
waitAndCheck = ->
  if JST? then boot()
  else
    console.log "[app] waiting for dependencies"
    setTimeout waitAndCheck, 250
waitAndCheck()
