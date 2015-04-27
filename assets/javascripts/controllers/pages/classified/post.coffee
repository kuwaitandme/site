module.exports = ($scope, $rootScope, $element, classified) ->
  @name = "[page:classified-post]"
  $rootScope.bodyid = "classified-post"
  console.log @name, "initializing"


  $scope.$watch 'title', (newValue="") ->
    minTitle = 20
    maxTitle = 140
    if minTitle < newValue.length < maxTitle
      remaining = maxTitle - newValue.length
      $scope.remainingTitle = "#{remaining} characters left"
    else $scope.remainingTitle = ""


  $scope.$watch 'description', (newValue="") ->
    minDescription = 50
    maxDescription = 2000
    if minDescription < newValue.length < maxDescription
      remaining = maxDescription - newValue.length
      $scope.remainingDescription = "#{remaining} characters left"
    else $scope.remainingDescription = ""

  $scope.addImages = ->
    $el = angular.element document.querySelectorAll "[type='file']"
    console.log 'clicked', $el
    $el[0].click()

  $scope.fileChange = -> console.log 'changing'

  $scope.validate = -> # _validateTitle()
  $scope.validate()