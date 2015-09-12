Provider = ($provide) ->
  decorator = ($log, $sniffer, $window) ->
    class CustomLogger
      constructor: (tag) -> @tag = "[#{tag}]"

      _perform: (fn, args=[]) ->
        args = [].slice.call args
        args.unshift @tag # Prepend tag
        fn.apply $log, args # Call the original function

      debug: -> @_perform $log.debug, arguments
      error: -> @_perform $log.error, arguments
      log:   -> @_perform $log.log,   arguments
      info:  -> @_perform $log.info,  arguments
      trace: -> @_perform $log.trace, arguments
      warn:  -> @_perform $log.warn,  arguments

    $log.init = (tag) -> new CustomLogger tag
    $log


  decorator.$inject = [
    "$delegate"
    "$sniffer"
    "$window"
  ]
  $provide.decorator "$log", decorator


Provider.$inject = ["$provide"]
module.exports = Provider