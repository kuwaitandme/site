exports = module.exports = ($stateProvider, $locationProvider, $urlMatcher,
  $urlRouterProvider) ->

  # Enable strict mode to allow URLs with trailing slashes
  $urlMatcher.strictMode false

  # Helper function to create our routes
  index = 0
  _route = (page, route) ->
    templateUrl = "news/views/#{page.replace 'news/', ''}/template"
    $stateProvider.state "#{page}-#{index++}",
      controller: "#{page}"
      templateUrl: templateUrl
      url: route
      resolve:
        categories: ["models.news.categories", (m) -> m.download()]
        user:       ["models.users",           (m) -> m.download()]
        language:   ["models.languages",       (m) -> m.download()]


  # Start adding each route one by one
  _route "news/categories",   "/news/categories"
  _route "news/index",        "/news/filters"
  _route "news/index",        "/news/recent"
  _route "news/index",        "/news/recent/page/{page:[0-9]+}"
  _route "news/index",        "/news/search"
  _route "news/index",        "/news/top"
  _route "news/index",        "/news/top/page/{page:[0-9]+}"
  _route "news/single",       "/news/story/{story:[^/]+}"
  _route "news/submit",       "/news/submit"
  _route "error/404",         "*page"


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
