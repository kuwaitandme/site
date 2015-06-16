## TODO: Add automatic resize of content
exports = module.exports = ($element, $location, $log, $notifications, $scope,
Classifieds, Locations, Users) ->
  @name = "[component:classified-form]"
  $log.log @name, "initializing"

  $scope.ctrl ?= {}
  $scope.locations = Locations.getAll()

  # Attach the css class for when the form is loading
  $scope.formClasses = loading: $scope.formLoading


  # updateAvailableCredits = ->
  #   userCredits = currentUser.credits or 0
  #   urgentPrice = (Number $scope.urgentPrice or 0) * 1
  #   promotePrice = (Number $scope.promotePrice or 0) * 1
  #   $scope.urgentPrice = String urgentPrice
  #   $scope.promotePrice = String promotePrice
  #   $scope.availableCredits = userCredits - (urgentPrice + promotePrice)
  # updateAvailableCredits()
  # $scope.$watch "urgentPrice", updateAvailableCredits
  # $scope.$watch "promotePrice", updateAvailableCredits

  # Get and set the current user
  currentUser = Users.getCurrent()
  $scope.ctrl.user = currentUser.get()

  # Set the super editable property iff the user is a moderator or an admin
  if currentUser.isModerator() or currentUser.isAdmin()
    $scope.superEditable = true


  # If the status has been changed, immediately submit the classified
  $scope.changeStatus = (newStatus) =>
    $log.debug @name, "changing status to : '#{newStatus}'"
    $scope.classified.status = Classifieds.statuses[newStatus]
    $scope.submit()


  # This function handlers when the form gets submitted.
  $scope.submit = =>
    # If the form is already sent to the server then avoid resubmitting.
    if $scope.formLoading then return

    # Set the attempted class so that CSS can highlight invalid any fields
    $scope.formClasses.attempted = true

    # Check if the form is invalid or if the captcha has not been filled
    if $scope.form.$invalid
      error = "You have some invalid fields in your form. Have a look at " +
        "them again"
    # if not $scope.ctrl.gcaptcha then error =  "You must pass the Captcha!"
    if error then return $notifications.error error

    # Now combine together all the data from the form and bring it to a single
    # classified object
    classified = angular.extend(
      $scope.classified
      $scope.ctrl.categories
      $scope.ctrl.price
      {contact: $scope.contact or {}}
      {images: $scope.ctrl.images or []}
      {location: $scope.ctrl.location}
      {meta: angular.extend {}, $scope.meta, $scope.ctrl.maps}
    )

    headers = angular.extend(
      "x-csrf-token": $scope.ctrl.csrf
      "x-recaptcha": $scope.ctrl.gcaptcha
    )

    # Form is good to submit. Start the submission
    $scope.formLoading = $scope.formClasses.loading = true
    $log.log @name, "submitting form", classified

    # Delete the image.src (which contains the base64 data) to avoid
    # repetition of the image upload.
    delete image.src for image in ($scope.ctrl.images or [])

    # $scope.classified.spendUrgentPerk = $scope.urgentPrice
    # $scope.classified.spendPromotePerk = $scope.promotePrice
    Classifieds.save $scope.classified, headers
    .then (classified) -> $scope.$emit "classified-form:submitted", classified
    .catch (response) =>
      error = response.data
      $log.error @name, error
      switch error
        when "not enough credits"
          message = "You don't have enough credits"
        when "need login"
          message = "You must be logged in an account to manage a classified"
        when "email conflict"
          message = "That email address has an account with this site. You must login with that email otherwise this classified is considered as spam."
        when "not privileged"
          message = "You can't make changes to this classified"
        else
          message = "Something went wrong while saving your classified. Try again later"
      $notifications.error message, 10000
    .finally -> $scope.formLoading = $scope.formClasses.loading = false


exports.$inject = [
  "$element"
  "$location"
  "$log"
  "$notifications"
  "$scope"

  "models.classifieds"
  "models.locations"
  "models.users"
]
