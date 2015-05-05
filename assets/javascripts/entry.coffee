console.log "[app] initializing"
app = angular.module "App", ["ui.router"]

(require "./config")        app
(require "./controllers")   app
(require "./decorators")    app
(require "./directives")    app
(require "./factories")     app
(require "./filters")       app
(require "./run")           app
(require "./services")      app
(require "./values")        app