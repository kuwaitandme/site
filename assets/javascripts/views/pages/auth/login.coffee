url = (require 'app-helpers').url

module.exports = (require '../../mainView').extend
  name: "[view:auth-login]"
  template: template['auth/login']
  events: 'click .submit': 'submit'

  messages:
    activate_fail: 'Something went wrong while activating your account'
    activate_success: 'Your account is successfully activated'
    bad_fields: 'Please fill in the fields properly'
    login_disabled: 'You have been blocked temporarily for too many incorrect logins'
    login_inactive: 'Your account is not activated. <br> Check your inbox (and junk email) for an activation email'
    login_incorrect: 'Wrong email/password'
    logout: 'You have been logged out successfully'
    need_login: 'You need to be logged in in to view that page'
    reset_error: 'Something went wrong while resetting your password'
    reset_password_mismatch: 'The passwords have to match'
    reset_password_small: 'The password is too small (min 6 characters)'
    reset_sent: 'Password reset has been sent to your email'
    reset_success: 'Your password has been reset'
    send_again: 'Your account is not activated, check your email'
    signup_userexists: 'An account with that email already exists'
    signup_success: 'Your account has been created, Check your inbox (and junk email) for an activation email'
    user_suspended: 'This user has been suspended temporarily by a moderator'
    user_banned: 'Your account has been banned by a moderator'
    signup_taken: 'That account name has already been taken!'


  start: (@options) ->
    console.debug @name, 'initializing', @options

    # Set the model. Here the model for the classified will be the currently
    # logged in user.
    @model = @resources.currentUser

    # Initialize DOM elements
    @$form      = @$ "#login-form"
    @$links     = @$ ".extra-links"
    @$messages  = @$ "#auth-messages"
    @$password  = @$ "#auth-password"
    @$spinner   = @$ "#ajax-spinner"
    @$submit    = @$ ".submit"
    @$username  = @$ "#auth-username"



  continue: ->
    console.log @name, 'continuing'
    @parseURL()


  pause: -> (@$ '#g-recaptcha-response').remove()


  setupCaptcha: ->
    # Generate a random id to put in place of the captcha's id
    randomId = Math.floor (Math.random() * 1000)
    @captchaId = 'gcaptcha' + randomId
    @$captcha = @$ '.gcaptcha'
    @$captcha.attr 'id', @captchaId


  # This function parses the URL and prints out the appropriate message
  # based on the different GET parameters
  parseURL: ->
    console.log @name, 'parsing URL'

    error   = url.getParam 'error'
    success = url.getParam 'success'
    warning = url.getParam 'warning'
    if error   then @addMessage @messages[error],   'error'
    if success then @addMessage @messages[success], 'success'
    if warning then @addMessage @messages[warning], 'warning'


  # Renders the captcha while taking care of having collision with other
  # captchas in the page.
  renderCaptcha: ->
    console.log @name, 'setting captcha'

    (@$captcha.html "").show()
    if grecaptcha?
      if @captcha then @resetCaptcha()
      else @captcha = grecaptcha.render @captchaId,
        sitekey: window.data.captchaKey
        callback: (response) => @captchaSuccess response


  # Function that gets called when the captcha has been successfully entered
  captchaSuccess: (response) ->


  # Resets the Captcha properly by calling on google's reset function
  resetCaptcha: ->  if grecaptcha? then grecaptcha.reset @captcha

  showError: ($el, error) ->
    $parent = $el.parent().parent()
    $parent.addClass 'show-error'
    ($parent.find 'small').html error


  removeAllErrors: -> ($ '.show-error').removeClass 'show-error'


  # Validates the form before and displays any error messages if needed
  validate: ->
    status = true
    @removeAllErrors()

    isEmpty = (str) -> (str or "").trim().length == 0
    isSmall = (str) -> (str or "").trim().length < 5

    if isEmpty @$username.val()
      @showError @$username, 'Please give an email'
      status = false
    if isEmpty @$password.val()
      @showError @$password, 'Please give a password'
      status = false
    else if isSmall @$password.val()
      @showError @$password, 'Password should have min. 5 characters'
      status = false

    console.debug @name, 'form validation status:', status
    status


  # Adds a message of a given type. Type can be 'success', 'error' or
  # 'warning'
  addMessage: (message, type='error') ->
    $el = $ "<li> #{message} </li>"
    $el.hide()
    $el.addClass type
    @$messages.append $el
    $el.show()


  # Removes all the messages from the message container
  removeMessages: -> @$messages.html ""


  # Shows the AJAX loader and hides parts of the login form like the submit
  # button, the captcha etc..
  showLoading: ->
    @$spinner.show()
    @$submit.hide()


  # Hides the AJAX loader and displays parts of the login form back
  hideLoading: ->
    @$spinner.stop().hide()
    @$submit.stop().show()


  # Sends the AJAX request to the back-end
  submit: (event) ->
    console.log @name, 'submitting form'
    event.preventDefault()

    @removeMessages()
    @showLoading()

    # Validate the user fields
    if not @validate() then return @hideLoading()

    # Attempt to login the user
    @resources.currentUser.login @$username.val(), @$password.val(), (error, response) =>
      # Hide the ajax loader
      @hideLoading()

      if error then switch error.responseJSON.status
        when 'user not activated'
          @addMessage @messages['login_inactive'], 'warning'
        when 'invalid username/password'
          @addMessage @messages['bad_fields']
        when 'too many failed attempts'
          @addMessage @messages['login_disabled']
        when 'user not found', 'invalid password'
          @addMessage @messages['login_incorrect']
        when 'suspended'
          @addMessage @messages['user_suspended']
          reason = error.responseJSON.reason
          if reason then @addMessage "Reason: #{reason}"
        when 'banned'
          @addMessage @messages['user_banned']
          reason = error.responseJSON.reason
          if reason then @addMessage "Reason: #{reason}"
        else @addMessage error.responseText
      else
        console.debug @name, 'received user', response

        # Redirect to the account page on success
        @resources.router.redirect '/account'