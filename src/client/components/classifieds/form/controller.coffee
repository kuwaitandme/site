## TODO: Add automatic resize of content
exports = module.exports = ($element, $googleMaps, $imageResizer, $location, $log,
$notifications, $scope, Classifieds, Categories, Locations, Users) ->
  @name = "[component:classified-form]"
  currentUser = Users.getCurrent()
  $log.log @name, "initializing"

  $scope.ctrl =
    categories: {}
    contact: {}
    gcaptcha: null
    location: {}
    meta: {}
    price: {}
    user: currentUser.get()


  $scope.locations = Locations.getAll()
  # If classified is not defined, then set it to it's default values
  # $scope.classified ?= Classifieds.getDefault()
  # Setup some defaults for functions that might be overridden by the parent
  $scope.formClasses ?= {}
  # Attach the css class for when the form is loading
  $scope.formClasses.loading = $scope.formLoading


  updateAvailableCredits = ->
    userCredits = currentUser.credits or 0
    urgentPrice = (Number $scope.urgentPrice or 0) * 1
    promotePrice = (Number $scope.promotePrice or 0) * 1
    $scope.urgentPrice = String urgentPrice
    $scope.promotePrice = String promotePrice
    $scope.availableCredits = userCredits - (urgentPrice + promotePrice)
  updateAvailableCredits()
  $scope.$watch "urgentPrice", updateAvailableCredits
  $scope.$watch "promotePrice", updateAvailableCredits


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

    if not $scope.form.$invalid
      return $notifications.error "You have some invalid fields in your form. Have a look at them again"

    if not $scope.ctrl.gcaptcha
      return $notifications.error "You must pass the Captcha!"

    # Form is good to submit. Start the submission

    classified = angular.extend(
      $scope.classified
      $scope.ctrl.categories
      $scope.ctrl.price
      {contact: $scope.contact or {}}
      {images: $scope.ctrl.images}
      {location: $scope.ctrl.location}
      {meta: $scope.meta}
      {meta: $scope.maps}
    )

    headers = angular.extend(
      "x-csrf-token": $scope.ctrl.csrf
      "x-recaptcha": $scope.ctrl.gcaptcha
    )

    $scope.formLoading = $scope.formClasses.loading = true
    $log.log @name, "submitting form"

    # Delete the image.src (which contains the base64 data) to avoid
    # repetition of the image upload.
    delete image.src for image in ($scope.ctrl.images or [])

    # $scope.classified.spendUrgentPerk = $scope.urgentPrice
    # $scope.classified.spendPromotePerk = $scope.promotePrice
    Classifieds.save $scope.classified, headers
    .then (classified) ->
      $scope.$emit "classified-form:submitted", classified
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
    .finally ->
      $scope.formLoading = $scope.formClasses.loading = false


exports.$inject = [
  "$element"
  "$googleMaps"
  "$imageResizer"
  "$location"
  "$log"
  "$notifications"
  "$scope"

  "models.classifieds"
  "models.categories"
  "models.locations"
  "models.users"
]
