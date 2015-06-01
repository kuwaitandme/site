angular.module 'app', ['ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router']
  .config ($stateProvider, $urlRouterProvider) ->
    $stateProvider
      .state "home",
        url: "/",
        templateUrl: "app/main/main.html",
        controller: "MainCtrl"

    $urlRouterProvider.otherwise '/'

