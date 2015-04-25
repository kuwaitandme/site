console.log '[app] initializing'
app = angular.module 'App', ['ngRoute']

(require './controllers')   app
(require './decorators')    app
(require './directives')    app
(require './factories')     app
(require './filters')       app
(require './router')        app
(require './services')      app