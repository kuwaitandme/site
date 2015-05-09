exports = module.exports = -> new class
  name: "[provider:environment]"
  config: {}
  # This function is used to get the value of the given setting.
  get: (key) -> config["#{key}"]


  # This function is called by Angular when this provider is first invoked. Here
  # we base64 decode the cryptedData variable and we also merge in the values
  # from the publicData variable. This way we encapsulate all the settings that
  # the server gives us in a single provider.
  $get: [
    "$window"
    "$log"
    "$base64"
    ($window, $log, $base64) ->
      $log.log @name, "initializing"
      $log.log @name, "decoding server-side data"
      try
        # Decode the cryptedData
        @config = $base64.decode $window.cryptedData
        # Extend the properties of the publicData object
        @config[attr] = $window.publicData[attr] for attr in $window.publicData
        $log.debug @name, @config
      catch e
        $log.error @name, "error decoding server-side data"
        $log.error e
  ]