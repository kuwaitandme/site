urlHelpers = (require 'app-helpers').url

module.exports = Backbone.View.extend
  name: '[comp:payment-modal]'
  template: template['components/payment-modal']

  KWDtoUSD: 3.33

  initialize: (options={}) ->
    if options.resources then @resources = options.resources
    else @resources = App.resources

    console.log @name, 'initializing'
    console.debug @name, options

    @$el.html @template()
    @$modal = @$ "#payment-modal"
    @$submit = @$modal.find ".submit"
    @$spinner = @$ ".ajax-spinner"

    @$expiry = @$ "[name='expiry']"
    @$name = @$ "[name='name']"
    @$number = @$ "[name='number']"
    @$cvc = @$ "[name='cvc']"

    @$submit.click (event) => @submitHandle event
    @$spinner.hide()

    (@$ "form").card container: '.card-wrapper'


  setPurchaseOptions: (Credits, KWD, USD) ->
    diff = Math.round(((KWD * @KWDtoUSD) - USD) * 100) / 100

    (@$ '.buycredit-count').html Credits
    (@$ '.kwd').html "#{KWD}KWD"
    (@$ '.usd').html "$#{USD}"
    (@$ '.usd-converted').html "$#{KWD * @KWDtoUSD}"
    (@$ '.usd-diff').html "-$#{diff}"


  getCreditDetails: ->
    {
      ccNo: @$number.val().trim().split(' ').join('')
      cvv: Number @$cvc.val().trim()
      name: @$name.val().trim()
      expMonth: Number @$expiry.val().split('/')[0]
      expYear: Number @$expiry.val().split('/')[1]
    }
    {
      ccNo: "4000000000000002"
      cvv: "421"
      name: "John Doe"
      expMonth: "12"
      expYear: "16"
    }


  validateCreditDetails: (credit) -> true



  handleTransaction: (@credits=10, callback) ->
    @$modal.foundation "reveal", "open"
    @callback = callback or ->


  setErrorMessage: (message) ->




  submitHandle: (event) ->
    event.preventDefault()
    @$submit.hide()
    @$spinner.show()

    # Get the credit card details
    creditDetails = @getCreditDetails()
    data =
      credits: 10 #@credits
      publishableKey: window.config.TCO.publicKey
      sellerId: window.config.TCO.sid

    if not @validateCreditDetails creditDetails then return
    # else callback 'Invalid credit card details'

    _.extend data, creditDetails

    @getToken data, (error, token) =>
      console.log error, token
      data =
        token: token
        credits: 10
      @sendDataBackend data, (error, response) =>
        console.log error, response
        @callback error, response


  getToken: (data, callback) ->
    # Called when token creation fails.
    error = (response) ->
      switch response.errorCode
        when 300
          console.log '300'
        else console.log 's'
      console.error 'Could not get a transaction token' + response.errorMsg
      callback response

    # Called when token creation was successful
    success = (data) =>
      token = data.response.token.token
      console.log data
      callback null, token

    # Load the public key and request for the token
    TCO.loadPubKey 'sandbox', -> TCO.requestToken success, error, data


  sendDataBackend: (data, callback) ->
    $.ajax
      type: 'PUT'
      url: '/api/user'
      data: data
      dataType: 'json'
      success: (response) -> callback null, response
      error: (response) -> callback response