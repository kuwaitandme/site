exports = module.exports = ($stateProvider, $locationProvider, $urlMatcher,
  $urlRouterProvider) ->

  # Enable strict mode to allow URLs with trailing slashes
  $urlMatcher.strictMode false

  # Helper function to create our routes
  index = 0
  _route = (page, route) ->
    $stateProvider.state "#{page}-#{index++}",
      controller: "#{page}"
      templateUrl: "views/#{page}/template"
      url: route
      resolve:
        categories: ["models.forums.categories", (m) -> m.download()]
        user: ["models.users", (m) -> m.download()]
        # location: ["models.locations", (m) -> m.download()]
        # notifications: ["models.notifications", (m) -> m.download()]

  # _route "account/classifieds",         "/account/classifieds"
  # _route "account/classifieds/single",  "/account/classifieds/{id:[0-9]+}"
  # _route "account/moderate",            "/account/moderate"
  # _route "account/moderate/single",     "/account/moderate/{id:[0-9]+}"
  # _route "classified/category",         "/classified"
  # _route "classified/create",           "/classified/create"
  # _route "classified/finish",           "/classified/finish/{id:[0-9]+}"
  # _route "classified/search",           "/classified/{parent:[^/]+}"
  # _route "classified/search",           "/classified/{parent:[^/]+}/{child:[^/]+}"
  # _route "classified/single",           "/{slug:[^/]+}-{id:[0-9]+}"
  _route "comingsoon",                     "/account"
  _route "auth",                        "/auth"
  _route "auth/signup",                 "/signup"
  _route "auth/login",                  "/login"
  _route "auth/logout",                 "/auth/logout"
  _route "forums",                      "/forums"
  _route "forums/category",             "/forums/category/{parent:[^/]+}"
  _route "forums/recent-top",           "/forums/popular"
  _route "forums/recent-top",           "/forums/recent"
  _route "forums/topic",                "/forums/topic/{topic:[^/]+}"
  _route "news",                        "/meetups"
  _route "news",                        "/sharing"
  _route "stories",                     "/stories"
  # _route "index",                       ""
  _route "news",                        "/news/top"
  _route "news",                        "/news/categories"
  _route "news",                        "/news/top/page/{page:[0-9]+}"
  _route "news/single",                 "/news/story/{story:[^/]+}"
  _route "news/submit",                 "/news/submit"
  _route "news",                        "/news/filters"
  _route "news",                        "/news/recent"
  _route "users/single",                "/user/@{uname:[^\]+}"
  _route "news",                        "/news/recent/page/{page:[0-9]+}"
  _route "news",                        "/news/search"
  _route "error/404",                   "*page"

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