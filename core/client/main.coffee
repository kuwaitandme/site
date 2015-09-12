bootloader = require "./bootloader"

bootloader.initialize()
app = angular.module "app", [
  "ngCookies"
  "ui.router"
  "cfp.hotkeys"
]

# Add each of the angular components
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

# Add the router
app.config require "./router"
bootloader.start "app"