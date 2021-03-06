## TODO: Add automatic resize of content
exports = module.exports = ($element, $location, $log, $notifications, $scope,
$root, Classifieds, Locations, Users) ->
  name = "[component:classified-form]"
  currentUser = null
  $log.log name, "initializing"

  $scope.ctrl ?= {}
  $scope.locations = Locations.getAll()

  # Attach the css class for when the form is loading
  $scope.formClasses = loading: $scope.formLoading

  # Every time the user changes reset the current user and the classified's
  # owner (if needed).
  onUserChange = ->
    # Get and set the current user.
    currentUser = Users.getCurrent()

    # Give the classified an owner, if the classified has as id then fetch
    # the classified's owner from the API. Else leave the current user as the
    # user of this classified.
    if $scope.classified.id? and $scope.classified.owner
      Users.get $scope.classified.owner
      .success (user) -> $scope.ctrl.user = user
    else $scope.ctrl.user = currentUser.get()

    # Set the super editable property iff the user is a moderator or an admin.
    if currentUser.isModerator() or currentUser.isAdmin()
      $scope.superEditable = true


  # Now setup our listener and run the function once just to initialize things.
  $scope.$on "user:refresh", onUserChange
  onUserChange()


  # If the status has been changed, immediately submit the classified.
  # This just makes editing much more faster.
  #
  # TODO: Fix the security issue here with recaptcha...
  $scope.changeStatus = (newStatus) ->
    $log.debug name, "changing status to : '#{newStatus}'"
    $scope.classified.status = Classifieds.statuses[newStatus]
    $scope.submit()


  # This function handles when the form gets submitted.
  $scope.submit = ->
    # If the form is already sent to the server then avoid resubmitting.
    if $scope.formLoading then return

    # If the user isn't logged in then ask for the signup page using any of the
    # filled in details.
    if currentUser.isAnonymous()
      message = "You will need an account to create classifieds"
      $notifications.warn message, 10000
      $root.$broadcast "component:auth:show-signup", $scope.ctrl.user
      return

    # Check if the form is invalid or if the reCaptcha has not been filled.
    if $scope.form.$invalid
      error = "You have some invalid fields in your form. Have a look at
        them again"
    # if not $scope.ctrl.gcaptcha then error =  "You must pass the Captcha!"
    if error then return $notifications.error error


    # Now combine together all the data from the form and bring it to a single
    # classified object.
    classified = {}
    angular.extend(
      classified
      $scope.classified
      $scope.ctrl.categories
      $scope.ctrl.price
      {contact: $scope.contact or {}}
      {images: $scope.ctrl.images or []}
      {location: $scope.ctrl.location}
      {meta: angular.extend {}, $scope.meta, $scope.ctrl.maps}
    )

    $log.log name, "sending"

    headers =
      "x-csrf-token": $scope.ctrl.csrf
      "x-recaptcha": $scope.ctrl.gcaptcha

    # Form is good to submit; Start the submission.
    $log.log name, "submitting form", classified

    # Set the CSS class.
    $root.bodyClasses["show-loader"] = $scope.formClasses.loading = true

    # Set the loading flag.
    $scope.formLoading = true

    # Now pass the classified object to the save function which will take care
    # of uploading the classified..
    Classifieds.save classified, headers

    # If classified could be submitted properly then send the success event
    # so that the parent controllers can act accordingly.
    .then (classified) -> $scope.$emit "classified-form:submitted", classified

    # Else handle any error.
    .catch (response) ->
      error = response.data
      $log.error name, error

      switch error
        when "not enough credits" then message = "You don't have enough credits"
        when "need login" then message = "You must be logged in an account to
          manage a classified"
        when "email conflict" then message = "That email address has an account
          with this site. You must login with that email otherwise this
          classified is considered as spam."
        when "not privileged" then message = "You can't make changes to this
          classified"
        else message = "Something went wrong while saving your classified. Try
          again later"
      $notifications.error message, 10000

    # After submitting the classified, make sure we reset the flags and CSS
    # classes..
    .finally ->
      $root.bodyClasses["show-loader"] = $scope.formClasses.loading = false
      $scope.formLoading = false


exports.$inject = [
  "$element"
  "$location"
  "$log"
  "$notifications"
  "$scope"
  "$rootScope"

  "models.classifieds"
  "models.locations"
  "models.users"
]
