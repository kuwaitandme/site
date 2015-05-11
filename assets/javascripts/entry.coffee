console.log "[app] initializing"
app = angular.module "App", [
  # "btford.socket-io"
  "ui.router"
]

(require "./config")        app
(require "./controllers")   app
(require "./directives")    app
(require "./factories")     app
(require "./filters")       app
(require "./providers")     app
(require "./run")           app
(require "./services")      app
(require "./values")        app