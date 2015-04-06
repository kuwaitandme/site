module.exports = Backbone.View.extend
  name: '[view:contact]'
  template: template['contact']
  events: 'click .submit': 'submit'
  title: -> "Contact Us"


  start: ->
    # Generate a random id to put in place of the captcha's id
    randomId    = Math.floor (Math.random() * 1000)
    @$captcha   = @$ ".gcaptcha"
    @$submit    = @$ ".submit"
    @$email     = @$ "[name='email']"
    @$message   = @$ "[name='message']"
    @$messages  = @$ "ul.messages"

    @captchaId  = 'gcaptcha' + randomId
    @$captcha.attr 'id', @captchaId
    @renderCaptcha()


  renderCaptcha: ->
    console.log @name, 'setting captcha'
    @$submit.hide()
    (@$captcha.html "").show()
    if grecaptcha?
      if @captcha then @resetCaptcha()
      else @captcha = grecaptcha.render @captchaId,
        sitekey: window.config.reCaptcha
        callback: (response) => @captchaSuccess response



  captchaSuccess: (response) ->
    @$submit.show()
    @$captcha.hide()
    console.log @name, 'captcha success'


  resetCaptcha: ->
    @$captcha.show()
    grecaptcha.reset @captcha


  validate: ->
    status = true
    @removeAllErrors()

    isEmpty = (str) -> (str or "").trim().length == 0
    if isEmpty @$email.val()
      @addMessage 'Your email is required for us to reply back to you!'
      status = false
    if isEmpty @$message.val()
      @addMessage 'Nothing to say? :('
      status = false

    console.debug @name, 'form validation status:', status
    status


  removeAllErrors: ->
    ($ '.show-error').removeClass 'show-error'
    @$messages.html ""


  # Adds a message of a given type. Type can be 'success', 'error' or
  # 'warning'
  addMessage: (message, type='error') ->
    $el = $ "<li> #{message} </li>"
    $el.hide()
    $el.addClass type
    @$messages.append $el
    $el.show()


  # Sends the message to the back-end
  submit: (event) ->
    ajax = (require 'app-helpers').ajax
    console.debug @name, 'submitting form', event
    event.preventDefault()

    validated = @validate()
    console.debug @name, 'validating form', validated
    if not validated then return

    @$submit.hide()
    parameters =
      email: @$email.val()
      message: @$message.val()

    # Send the AJAX request
    $.ajax
      type: 'POST'
      url: '/api/contact'
      dataType: 'json'
      data: parameters
      beforeSend: ajax.setHeaders
      success: (response) =>
        @addMessage 'Your message has been sent!', 'success'
      error: (response) =>
        console.log response, typeof response
        @resetCaptcha()
        @addMessage response.responseJSON