exports = module.exports = -> new class
  name = "[provider:i18n]"

  ###
    This function is called by Angular when this provider is first invoked.
  ###
  $get: [
    "$window"
    "$log"
    "$base64"
    "$timeout"
    ($window, $log, $base64, $timeout) ->
      $log.log name, "initializing"
      $log.log name, "decoding server-side data"

      $timeout 1000
      .then -> {}
  ]