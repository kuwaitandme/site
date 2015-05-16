exports = module.exports = -> new class
  name: "[provider:environment]"

  # This function is called by Angular when this provider is first invoked. Here
  # we base64 decode the cryptedData variable and we also merge in the values
  # from the publicData variable. This way we encapsulate all the settings that
  # the server gives us in a single provider.
  $get: [
    "$window"
    "$log"
    "$base64"
    ($window, console, $base64) ->
      console.log @name, "initializing"
      console.log @name, "decoding server-side data"
      try
        config = {}
        # Decode the cryptedData and extend the properties of the publicData
        # object
        angular.extend config, $window.publicData,
          angular.fromJson $base64.decode $window.cryptedData
        @config = config
        console.debug @name, @config
        return config
      catch e
        console.error @name, "error decoding server-side data"
        console.error e
        return {}
  ]