module.exports = (app) ->
  @name = "[router]"
  console.log @name, "initializing"

  app.config ($stateProvider, $locationProvider) ->
    $stateProvider.state "landing",
      controller: "page:landing"
      templateUrl: "landing"
      url: "/{lang:en|ar}"

    # .state "classified-single",
    #   controller: "page:classified/single"
    #   templateUrl: "classified/single"
    #   url: "/(en|ar)/classified/{id:[a-f0-9]*}"

    .state "guest-post",
      controller: "page:classified/post"
      templateUrl: "classified/post"
      url: "/{lang:en|ar}/guest/post"

    $locationProvider.html5Mode true