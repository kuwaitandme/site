name = "[component:auth-modal]"


exports = module.exports = ($scope, $element, $root, $timeout, $location, $log,
$notifications, Messages, close) ->
  $log.log name, "initializing"

  id = $scope.id

  $scope.submit = ->
    # Check if the form is invalid or if the reCaptcha has not been filled.
    if $scope.form.$invalid
      error = "You have some invalid fields in your form. Have a look at
        them again"
    # if not $scope.ctrl.gcaptcha then error =  "You must pass the Captcha!"
    if error then return $notifications.error error

    # Attach the classified's id
    $scope.loading = true
    $scope.data.id = $scope.id

    # Send the message!
    Messages.create $scope.data, Messages.types.CLASSIFIED

    # If the message could be sent, then hide the modal and show a notification.
    .then ->
      $notifications.success "Your message was sent"
      close()

    # Handle any errors here
    .catch -> $notifications.error "Your message could not be sent, try again
      later"

    # Remove the loading class.
    .finally -> $scope.loading = false



exports.$inject = [
  "$scope"
  "$element"
  "$rootScope"
  "$timeout"
  "$location"
  "$log"
  "$notifications"

  "models.messages"
  "close"
]
