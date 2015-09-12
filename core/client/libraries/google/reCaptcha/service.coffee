module.exports = Service = ($log, $window, Environment) ->
  logger = $log.init Service.tag

  new class
    constructor: ->
      logger.log "initializing"
      logger.debug Environment.google.reCaptchaKey

      #! Prepare the URL for the reCaptcha API
      url = "//www.google.com/recaptcha/api.js"

      #! Insert the script into the DOM
      $fileref = document.createElement "script"
      $fileref.type = "text/javascript"
      $fileref.src = url
      head = (document.getElementsByTagName "head")[0]
      head.insertBefore $fileref, head.firstChild


    onLoad: (callback) ->
      waitForElement = ->
        if $window.grecaptcha? then callback and callback()
        else setTimeout (-> waitForElement()), 250
      waitForElement()


    # NOT TESTED!
    # This simply resets the reCaptcha object
    reset: (widgetId) -> @onLoad -> $window.grecaptcha.reset widgetId


    initialize: (elementId, options) ->
      logger.log name, "initializing captcha on DOM id:", elementId
      @onLoad ->
        widgetId = $window.grecaptcha.render elementId,
          callback: (response) -> options.callback response
          sitekey: Environment.google.reCaptchaKey

        if options.widgetId? then options.widgetId widgetId


Service.tag = "service:google-recaptcha"
Service.$inject = [
  "$log"
  "$window"
  "@environment"
]