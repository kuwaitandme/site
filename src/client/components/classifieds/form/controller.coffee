## TODO: Add automatic resize of content
exports = module.exports = ($element, $googleMaps, $imageResizer, $location, $log,
$notifications, $scope, Classifieds, Categories, Locations, Users) ->
  @name = "[component:classified-form]"
  currentUser = Users.getCurrent()
  $log.log @name, "initializing"

  $scope.price = null
  $scope.gcaptcha = null

  # Initialize the models
  $scope.categories = Categories.getAll()
  $scope.locations = Locations.getAll()
  # If classified is not defined, then set it to it's default values
  # $scope.classified ?= Classifieds.getDefault()
  # Setup some defaults for functions that might be overridden by the parent
  $scope.formClasses ?= {}
  # Attach the css class for when the form is loading
  $scope.formClasses.loading = $scope.formLoading

  # r = ->
  #   console.log ">", $scope.classified
  #   setTimeout r, 1000
  # r()
  # # setT
  # $scope.$watch "classified", (a) ->
  #   console.log 'title', a
  # , true

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

  # Automatically populate and/or disable the email field
  $scope.user = currentUser
  # if not $scope.classified.contact.email? and currentUserEmail?
  #   $scope.disableEmailField = true
  #   $scope.classified.contact.email = currentUserEmail
  # if $scope.classified.contact.email? then $scope.disableEmailField = true

  # $scope.location = Locations.findById $scope.classified.location

  # Set the super editable property iff the user is a moderator or an admin
  currentUser = currentUser or {}
  roles = Users.roles
  # $scope.superEditable = currentUser.role in [roles.MODERATOR, roles.ADMIN]


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

    classified = angular.extend(
      $scope.classified
      $scope.categories
      $scope.location
      $scope.price
      {contact: $scope.contact}
      {images: $scope.images}
      {meta: $scope.maps}
      {meta: $scope.meta}
    )

    if not $scope.form.$invalid
      return $notifications.error "You have some invalid fields in your form. Have a look at them again"

    if not $scope.form.gcaptcha
      return $notifications.error "You must pass the Captcha!"

    # Form is good to submit. Start the submission
    $scope.formLoading = $scope.formClasses.loading = true
    $log.log @name, "submitting form"

    # Delete the image.src (which contains the base64 data) to avoid
    # repetition of the image upload.
    delete image.src for image in ($scope.classified.images or [])

    # $scope.classified.spendUrgentPerk = $scope.urgentPrice
    # $scope.classified.spendPromotePerk = $scope.promotePrice
    Classifieds.save $scope.classified, (error, classified) =>
      $scope.formLoading = $scope.formClasses.loading = false
      if error
        $log.error @name, error
        switch error
          when "not enough credits"
            message = "You don't have enough credits"
          when "need login"
            message = "You must be logged in an account to post a classified"
          when "email conflict"
            message = "That email address has an account with this site. You must login with that email otherwise this classified is considered as spam."
          when "not privileged"
            message = "You can't make changes to this classified"
          else
            message = "Something went wrong while saving your classified. Try again later"
        $notifications.error message, 10000
      else $scope.$emit "classified-form:submitted", classified


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
