module.exports = (app) ->
  @name = "[router]"
  console.log @name, "initializing"

  router = ($stateProvider, $locationProvider, $urlMatcher, $urlRouterProvider) ->
    $urlMatcher.strictMode false
    _route = (page, route) ->
      $stateProvider.state "#{page}",
        controller: "page:#{page}"
        templateUrl: "#{page}"
        url: route
        resolve:
          categories: ["model.category", (category) -> category.download()]
          user:       ["model.user",     (user)     -> user.download()]
          location:   ["model.location", (location) -> location.download()]

    # $urlRouterProvider.otherwise "/page-not-found"

    _route "account/index",      "/account"
    _route "account/manage",     "/account/manage"
    _route "auth/login",         "/auth/login"
    _route "auth/signup",        "/auth/signup"
    _route "classified/post",    "/classified/post"
    _route "classified/search",  "/classified"
    _route "classified/single",  "/classified/{id:[a-f0-9]+}"
    _route "guest/post",         "/guest/post"
    _route "landing",            "/"

    _route "404",                "*page"
    # Enable HTML5 pushstate for hash-less URLs
    $locationProvider.html5Mode
      enabled: true
      requireBases: false


  app.config ["$stateProvider", "$locationProvider",
    "$urlMatcherFactoryProvider", "$urlRouterProvider", router]