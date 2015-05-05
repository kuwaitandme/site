exports = module.exports = ($stateProvider, $locationProvider, $urlMatcher,
  $urlRouterProvider) ->
  @name = "[router]"
  console.log @name, "initializing"

  # Enable strict mode to allow URLs with trailing slashes
  $urlMatcher.strictMode false

  # Helper function to create our routes
  index = 0
  _route = (page, route) ->
    $stateProvider.state "#{page}-#{index++}",
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
  _route "auth/logout",        "/auth/logout"
  _route "auth/signup",        "/auth/signup"
  _route "guest/post",         "/guest/post"
  _route "landing",            "/"
  _route "classified/finish",  "/{slug:[^/]+}/finish"
  _route "classified/single",  "/{slug:[^/]+}"
  _route "classified/post",    "/classified/post"
  _route "classified/search",  "/classified"
  _route "classified/search",  "/classified/{parent:[^/]+}"
  _route "classified/search",  "/classified/{parent:[^/]+}/{child:[^/]+}"

  _route "404",                "*page"

  # Enable HTML5 pushstate for hash-less URLs
  $locationProvider.html5Mode
    enabled: true
    requireBases: false

exports.$inject = [
  "$stateProvider"
  "$locationProvider"
  "$urlMatcherFactoryProvider"
  "$urlRouterProvider"
]