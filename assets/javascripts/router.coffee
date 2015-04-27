module.exports = (app) ->
  @name = "[router]"
  console.log @name, "initializing"

  app.config ($stateProvider, $locationProvider, $urlMatcherFactoryProvider) ->
    $urlMatcherFactoryProvider.strictMode false
    $stateProvider.state "landing",
      controller: "page:landing"
      templateUrl: "landing"
      url: "/{lang:(?:en|ar)}"
      # url: "/en"

    .state "classified-single",
      controller: "page:classified/single"
      templateUrl: "classified/single"
      url: "/{lang:(?:en|ar)}/classified/{id:[a-f0-9]*}"

    .state "classified-post",
      controller: "page:classified/post"
      templateUrl: "classified/post"
      url: "/en/classified/post"

    .state "guest-post",
      controller: "page:classified/post"
      templateUrl: "classified/post"
      url: "/en/guest/post"

    .state "auth-login",
      controller: "page:auth/login"
      templateUrl: "auth/login"
      url: "/en/auth/login"

    .state "auth-signup",
      controller: "page:auth/signup"
      templateUrl: "auth/signup"
      url: "/en/auth/signup"

    $locationProvider.html5Mode
      enabled: true
      requireBase: false