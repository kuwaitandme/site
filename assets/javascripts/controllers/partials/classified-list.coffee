controller = ($scope, $location, $http) ->
  @name = '[comp:classified-single]'

  console.log @name, "initializing"
  console.debug @name, "scope", $scope

  $scope.classifieds = []
  $scope.classifieds = require './data.js'

  $http.post "/api/query"
  .success (response) ->
    console.log response

  $scope.onScroll = ->
    console.log @name, "scrolling"


module.exports = controller