

# Initializes each of the controllers one by one.
module.exports =
  cache: require './localStorage'
  router:          require './router'
  viewManager:     require './viewManager'

  name: '[controller]'

  initialize: (app, config) ->
    console.log @name, 'initializing'

    # Rewrite backbone sync with our custom sync function. For now add our
    # little hack to bypass the CSRF token. NOTE that we must find another
    # way to have CSRF added into every AJAX call without having to making
    # more than one request.
    backboneSync = Backbone.sync
    newSync = (method, model, options) ->
      options.beforeSend = (xhr) ->
        # Set the captcha header
        captcha = ($ '[name="g-recaptcha-response"]').val()
        if captcha then xhr.setRequestHeader 'x-gcaptcha', captcha

        # Set the CSRF skipper
        xhr.setRequestHeader 'x-csrf-skipper'
      backboneSync method, model, options
    Backbone.sync = newSync

    @localStorage   = new localStorage app, config
    @router         = new router
    @viewManager    = new viewManager app, config

    @viewManager.localStorage = @localStorage
    @viewManager.router = @router


  start: ->
    console.log @name, 'starting'
    @viewManager.models = @models

    @viewManager.start()
    @router.start()