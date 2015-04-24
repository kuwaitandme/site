console.log '[app] initializing'
app = angular.module 'App', ['ngRoute']

(require './directives')  app
(require './filters')     app
(require './services')    app
(require './controllers') app
(require './router')      app
(require './decorators')  app