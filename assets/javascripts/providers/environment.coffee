exports = module.exports = -> new class
  name: "[provider:environment]"

  constructor: ->
    console.log @name, "initializing"
    envConfig = restUrl: 'http://localhost:8080/rest/api/'

  $get: [
    "$window"
    "$log"
    "$base64"
    ($window, $log, $base64) ->
      console.log 'sdf'
      try @config = $base64.decode $window.config
      catch e then $log.error e
  ]