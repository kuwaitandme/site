module.exports = Backbone.View.extend
  name: '[view:classified-post:submit]'
  template: template['classified/post/submit']

  start: (options) ->
    @$submit  = @$ '.submit'

    # Generate a random id to put in place of the captcha's id
    randomId    = Math.floor (Math.random() * 1000)
    @captchaId = "gcaptcha-#{randomId}"
    @$captcha   = @$ '.gcaptcha'
    @$captcha.attr 'id', @captchaId


  continue: -> @renderCaptcha()

  validate: ->
    val = (@$ '.g-recaptcha-response').val()

    # Only if the captcha is defined will we check it for validation
    if @captcha and not val or val == '' then return false
    true

  renderCaptcha: ->
    console.log @name, 'setting captcha'

    (@$captcha.html "").show()
    @$submit.hide()
    GoogleRecaptcha = new @resources.external.GoogleRecaptcha
    GoogleRecaptcha.onLoad =>
      if @captcha then grecaptcha.reset @captcha
      else @captcha = grecaptcha.render @captchaId,
        sitekey: window.config.reCaptcha
        callback: (response) => @captchaSuccess response


  captchaSuccess: (response) ->
    console.log @name, 'captcha success'
    @$submit.show()
    @$captcha.hide()


  resetCaptcha: -> grecaptcha.reset @captcha