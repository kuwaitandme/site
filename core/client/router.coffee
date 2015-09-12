Router = ($stateProvider, $locationProvider, $urlMatcher, $urlRouterProvider) ->
  # Disable strict mode to allow URLs with trailing slashes
  $urlMatcher.strictMode false

  # Helper function to create our routes
  index = 0
  _route = (page, route) ->
    templateUrl = "views/#{page}/template"
    $stateProvider.state "#{page}-#{index++}",
      controller: page
      page: page
      templateUrl: templateUrl
      url: route
      resolve:
        categories: ["@models/sharing/categories", (m) -> m.download()]
        user:       ["@models/users",           (m) -> m.download()]
        language:   ["@models/languages",       (m) -> m.download()]


  #! Start adding each route one by one
  _route "auth/login",         "/login"
  _route "auth/logout",        "/logout"
  _route "auth/login",         "/login/forgot"
  _route "auth/signup",        "/signup"

  _route "info/about",         "/info/about"
  _route "info/contribute",    "/info/contribute"
  _route "info/terms-privacy", "/info/terms-privacy"

  _route "sharing/categories",    "/categories"
  _route "sharing/filters",       "/filters"
  _route "sharing/category",      "/category/{cat:[^/]+}/recent"
  _route "sharing/category",      "/category/{cat:[^/]+}/recent/page/{page:[0-9]+}"
  _route "sharing/category",      "/category/{cat:[^/]+}"
  _route "sharing/category",      "/category/{cat:[^/]+}/page/{page:[0-9]+}"
  _route "sharing/index",         ""
  _route "sharing/settings",      "/settings"
  _route "sharing/index",         "/page/{page:[0-9]+}"
  _route "sharing/recent",        "/recent"
  _route "sharing/recent",        "/recent/page/{page:[0-9]+}"
  _route "sharing/search",        "/search"
  _route "sharing/single",        "/story/{story:[^/]+}"
  _route "sharing/submit",        "/submit"

  _route "error/404",         "*page"


  #! Enable HTML5 pushstate for hash-less URLs
  $locationProvider.html5Mode
    enabled: true
    requireBases: false


Router.$inject = [
  "$stateProvider"
  "$locationProvider"
  "$urlMatcherFactoryProvider"
  "$urlRouterProvider"
]
module.exports = Router