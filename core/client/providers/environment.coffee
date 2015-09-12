module.exports = ->
  Provider = -> null

  ###
    This function is called by Angular when this provider is first invoked.
    Here we base64 decode the cryptedData variable and we also merge in the
    values from the publicData variable. This way we encapsulate all the
    settings that the server gives us in a single provider.
  ###
  Provider::$get = ($window, $log, base64) ->
    logger = $log.init Provider.tag
    logger.log "initializing"
    logger.log "decoding server-side data"

    try
      config = {}
      # Decode the cryptedData and extend the properties of the publicData
      # object
      angular.extend config, $window.publicData,
        angular.fromJson base64.decode $window.cryptedData
      @config = config
      return config
    catch e
      logger.error "error decoding server-side data"
      logger.error e
      return {}


  Provider::$get.$inject = [
    "$window"
    "$log"
    "@base64"
  ]


  Provider.tag = "provider:environment"
  new Provider