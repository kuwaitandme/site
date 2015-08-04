app = angular.module "app.news", ["app.common"]

# Add each of the angular components
(require "./components")    app
(require "./models")        app
(require "./views")         app

# Add the router
app.config require "./router"

# Helper function to boot the angular App.
boot = ->
  html = (document.getElementsByTagName "html")[0]
  body = angular.element (document.getElementsByTagName "body")[0]
  body.removeClass "initializing"
  angular.bootstrap html, ["app.news"]
  window.BOOTSTRAP_OK = true


# Now only boot the angular app, if the JST template has been loaded. Because
# we can't really determine which async script loads first. This way we avoid
# script from breaking due to race conditions..
#
# http://stackoverflow.com/questions/8996852/load-and-execute-order-of-scripts
#
# We wait for all the dependencies to be loaded first, before executing the
# angular app itself.
#
# This recursive function will keep on checking for the JST and variable to be
# defined. And when it does get defined, it will boot the app!
waitAndCheck = -> if JST? then boot() else setTimeout waitAndCheck, 250
waitAndCheck()
