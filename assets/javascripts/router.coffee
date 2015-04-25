module.exports = (app) ->
  @name = "[router]"
  console.log @name, "initializing"

  app.config ($stateProvider, $urlRouterProvider, $locationProvider) ->
    $stateProvider.state "landing",
      controller: "page:landing"
      templateUrl: "landing"
      url: "/"

    .state "classified-single",
      controller: "page:classified/single"
      templateUrl: "classified/single"
      url: "/classified/{id:[a-f0-9]*}"


    # # console.log $routeProvider, $locationProvider
    # # $locationProvider.html5Mode true
    # $routeProvider.when "/",
    #   controller: "page:landing"
    #   templateUrl: "landing"
    # $routeProvider.when "/classified/{id:[a-f0-9]*}",
    #   controller: "page:classified/single"
    #   templateUrl: "classified/single"
    # # $routeProvider.otherwise redirectTo: "/"
    # # $routeProvider.when "/", controller: "PageCtrl"
    #   # templateUrl: "chapter.html",
    #   #