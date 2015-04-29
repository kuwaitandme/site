exports = module.exports = ($scope, $element, classified, category) ->
  @name = "[page:classified-post]"
  console.log @name, "initializing"

  body = document.getElementsByTagName "body"
  body[0].id = "classified-post"

  $scope.classified = {}
  $scope.categories = category.getAll()
  $scope.locations = category.getAll()

  # Function to listen for changes with classified title
  titleChange = (newValue="") ->
    minTitle = 20
    maxTitle = 140
    if minTitle < newValue.length < maxTitle
      remaining = maxTitle - newValue.length
      $scope.remainingTitle = "#{remaining} characters left"
    else $scope.remainingTitle = ""
  $scope.$watch "title", titleChange

  # Function to listen for changes with classified description
  descriptionChange = (newValue="") ->
    minDescription = 50
    maxDescription = 2000
    if minDescription < newValue.length < maxDescription
      remaining = maxDescription - newValue.length
      $scope.remainingDescription = "#{remaining} characters left"
    else $scope.remainingDescription = ""
  $scope.$watch "description", descriptionChange

  $scope.addImages = ->
    $el = angular.element document.querySelectorAll "[type='file']"
    console.log "clicked", $el
    $el[0].click()

  $scope.fileChange = (files) ->
    $scope.files = $scope.files or []
    $scope.$apply ->
      for file in files then $scope.files.push file: file
    console.log $scope.files
    $scope.$apply()
    console.log "changing", files

  $scope.validate = -> # _validateTitle()
  $scope.validate()


exports.$inject = [
  "$scope"
  "$element"
  "model.classified"
  "model.category"
]