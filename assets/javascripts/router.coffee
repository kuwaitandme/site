module.exports = (app) ->
  @name = "[router]"
  console.log @name, "initializing"

  app.config ($stateProvider, $locationProvider) ->
    $stateProvider.state "landing",
      controller: "page:landing"
      templateUrl: "landing"
      url: "/{lang:(?:en|ar)}"
      # url: "/en"

    .state "classified-single",
      controller: "page:classified/single"
      templateUrl: "classified/single"
      url: "/{lang:(?:en|ar)}/classified/{id:[a-f0-9]*}"

    .state "guest-post",
      controller: "page:classified/post"
      templateUrl: "classified/post"
      url: "/en/guest/post"

    $locationProvider.html5Mode true