exports = module.exports = ($scope, $stateParams, console, $location,
  $notifications, Classifieds) ->
  @name = "[page:classified-edit]"
  console.log @name, "initializing",

  Classifieds.get $stateParams.id, (error, classified) =>
    for image in classified.images or []
      image.status = "on-server"
      image.src = "/uploads/thumb/#{image.filename}"
    $scope.classified = classified

  # When classified has been edited successfully, redirect to the account
  # page
  $scope.onSuccess = (classified) ->
    $notifications.success "Your classified has been edited successfully!"
    $location.path "/account/manage"


exports.$inject = [
  "$scope"
  "$stateParams"
  "$log"
  "$location"
  "$notifications"

  "model.classifieds"
]