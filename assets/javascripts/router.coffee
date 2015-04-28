module.exports = (app) ->
  @name = "[router]"
  console.log @name, "initializing"

  app.config ($stateProvider, $locationProvider, $urlMatcherFactoryProvider) ->
    $urlMatcherFactoryProvider.strictMode false
    $stateProvider.state "landing",
      controller: "page:landing"
      templateUrl: "landing"
      url: "/"

    .state "classified-single",
      controller: "page:classified/single"
      templateUrl: "classified/single"
      url: "/classified/{id:[a-f0-9]+}"

    .state "classified-search",
      controller: "page:classified/search"
      templateUrl: "classified/search"
      url: "/classified"

    .state "classified-post",
      controller: "page:classified/post"
      templateUrl: "classified/post"
      url: "/classified/post"

    .state "guest-post",
      controller: "page:classified/post"
      templateUrl: "classified/post"
      url: "/guest/post"

    .state "auth-login",
      controller: "page:auth/login"
      templateUrl: "auth/login"
      url: "/auth/login"

    .state "auth-signup",
      controller: "page:auth/signup"
      templateUrl: "auth/signup"
      url: "/auth/signup"

    .state "account",
      controller: "page:account"
      templateUrl: "account/index"
      url: "/account"

    $locationProvider.html5Mode
      enabled: true
      requireBase: false