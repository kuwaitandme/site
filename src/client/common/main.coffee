app = angular.module "app.common", [
  # "ngCookies"
  # "ngSanitize"
  "ngTouch"
  "ui.router"
  "cfp.hotkeys"
  "angular-md5"
  # "btford.socket-io"
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
