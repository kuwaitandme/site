module.exports = (app) ->
  @name = "[router]"
  console.log @name, "initializing"

  app.config ($stateProvider, $locationProvider, $urlMatcherFactoryProvider) ->
    # console.log user
    $urlMatcherFactoryProvider.strictMode false
    _route = (page, route) ->
      $stateProvider.state "#{page}",
        controller: "page:#{page}"
        templateUrl: "#{page}"
        url: route
        resolve:
          downloadUser: (user) -> user.downloadCurrentUser()

    _route "account/index",     "/account/index"
    _route "account/manage",    "/account/manage"
    _route "auth/login",        "/auth/login"
    _route "auth/signup",       "/auth/signup"
    _route "classified/post",   "/classified/post"
    _route "classified/search", "/classified"
    _route "classified/single", "/classified/{id:[a-f0-9]+}"
    _route "guest/post",        "/guest/post"
    _route "landing",           "/"


    $locationProvider.html5Mode
      enabled: true
      requireBase: false