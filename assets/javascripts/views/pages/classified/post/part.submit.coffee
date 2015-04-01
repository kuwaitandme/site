module.exports = Backbone.View.extend
  events: 'click .submit': 'submit'
  name: '[view:classified-post:submit]'


  initialize: (options) ->
    if options.model     then     @model = options.model
    if options.$el       then       @$el = options.$el
    if options.resources then @resources = options.resources

    @$submit  = @$ '.submit'
    @$spinner = @$ "#ajax-spinner"

    @listenTo @model, 'ajax:error', @ajaxError
    @on "close", @close

    # Generate a random id to put in place of the captcha's id
    randomId    = Math.floor (Math.random() * 1000)
    @captchaId  = 'gcaptcha' + randomId
    @$captcha   = @$ '.gcaptcha'
    @$captcha.attr 'id', @captchaId

    @renderCaptcha()

  # render: ->


  # Checks all the required fields in that particular page and prevents the
  # page from scrolling if any of the fields are empty.
  validate: ->
    val = (@$ '.g-recaptcha-response').val()

    # Only if the captcha is defined will we check it for validation
    if @captcha
      if not val or val == ''
        @model.trigger 'post:error', 'Please fill in the captcha properly'
        return false
    true

  # Sends the AJAX request to the back-end
  submit: (event) ->
    console.debug @name, 'submitting form', event

    event.preventDefault()
    validated = @validate()

    console.debug @name, 'validating form', validated
    if not validated then return

    @$submit.hide()
    @$spinner.show()
    # @model.save()
    @model.uploadServer()



  renderCaptcha: ->
    console.log @name, 'setting captcha'

    (@$captcha.html "").show()
    if grecaptcha?
      if @captcha then grecaptcha.reset @captcha
      else @captcha = grecaptcha.render @captchaId, sitekey: window.data.captchaKey


  resetCaptcha: -> grecaptcha.reset @captcha


  ajaxError: (event) ->
    @$submit.show()
    @$spinner.hide()
    @resetCaptcha()

    @model.trigger 'post:error', event.statusText

  close: ->
    @remove()
    @unbind()
    @stopListening()