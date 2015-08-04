exports = module.exports = ($stateProvider, $locationProvider, $urlMatcher) ->

  # Enable strict mode to allow URLs with trailing slashes
  $urlMatcher.strictMode false

  # Helper function to create our routes
  index = 0
  _route = (page, route) ->
    $stateProvider.state "#{page}-#{index++}",
      controller: "#{page}"
      templateUrl: "views/#{page}/template"
      url: route
      resolve: user: ["models.users", (m) -> m.download()]
        # location: ["models.locations", (m) -> m.download()]

  _route "comingsoon",                  "/account"
  _route "auth",                        "/auth"
  _route "auth/signup",                 "/signup"
  _route "auth/login",                  "/login"
  _route "auth/logout",                 "/auth/logout"
  _route "users/single",                "/user/@{uname:[^\]+}"
  _route "error/404",                   "*page"

  # Enable HTML5 pushstate for hash-less URLs
  $locationProvider.html5Mode
    enabled: true
    requireBases: false

exports.$inject = [
  "$stateProvider"
  "$locationProvider"
  "$urlMatcherFactoryProvider"
]
