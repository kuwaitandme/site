exports = module.exports = ($stateProvider, $locationProvider, $urlMatcher,
  $urlRouterProvider) ->

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
        categories: ["model.categories", (category) -> category.download()]
        user:       ["model.users",      (user)     -> user.download()]
        location:   ["model.locations",  (location) -> location.download()]

  _route "landing",            "/"
  _route "account/index",      "/account"
  _route "account/manage",     "/account/manage"
  _route "auth/index",         "/auth"
  _route "auth/signup",        "/auth/signup"
  _route "guest/post",         "/guest/post"

  _route "classified/finish",  "/classified/finish/{id:[0-9]+}"
  _route "classified/edit",    "/classified/edit/{id:[0-9]+}"
  _route "classified/post",    "/classified/post"

  _route "classified/search",  "/classified"
  _route "classified/search",  "/classified/{parent:[^/]+}"
  _route "classified/search",  "/classified/{parent:[^/]+}/{child:[^/]+}"

  _route "classified/single",  "/{slug:[^/]+}"
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