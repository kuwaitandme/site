###*
 * Entry point for the AngularJS App.
 *
 * @author Steven Enamakel <me@steven.pw>
###

name = "[app]"

# This block checks if the app has been booted properly (gives it 15s to
# load) which by at which time the App should have fixed the script cache and
# set the BOOTSTRAP_OK flag..
#
# We execute this first because in case anything wrong happens below the
# setTimeout() function will make sure the block below still executes because of
# it's async nature.
setTimeout ->
  console.log name, "checking for BOOTSTRAP_OK"
  if not window.BOOTSTRAP_OK
    console.warn name, "BOOTSTRAP_OK != true after 10s"

    # Check the flag
    if localStorage.getItem "boot:failed"
      console.warn name, "not reloading page as previous attempt failed"
      console.error name, "scripts failed to load"

      # TODO: redirect to a maintenance page
      document.body.innerHTML = "The site is under maintenance or your Internet
      connection is really slow"
    else
      console.warn name, "something wrong with loading scripts. Clearing cache now,
       setting a flag and reloading the page"
      # Clear the cache entirely!
      localStorage.clear()

      # Set a flag
      localStorage.setItem "boot:failed", "true"

      # And now reload the page
      location.reload()
  else
    localStorage.removeItem "boot:failed"
    console.log name, "BOOTSTRAP_OK set properly!"
, 3000


console.log name, "initializing with angular"
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
(require "./models")        app
(require "./providers")     app
(require "./run")           app
(require "./services")      app
(require "./values")        app
(require "./views")         app


# Helper function to boot the angular App.
boot = ->
  console.log name, "bootstraping angular"
  html = (document.getElementsByTagName "html")[0]
  body = angular.element (document.getElementsByTagName "body")[0]
  body.removeClass "initializing"
  angular.bootstrap html, ["App"]
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
waitAndCheck = ->
  if JST? then boot()
  else
    console.log name, "waiting for dependencies"
    setTimeout waitAndCheck, 250
waitAndCheck()
