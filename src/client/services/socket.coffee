exports = module.exports = ($socketFactory, $log) -> new class
  @name: "[socket]"

  constructor: ->
    $log.log @name, "initializing"
    # iosocket = io.connect "/"
    socket = socketFactory ioSocket: myIoSocket

exports.$inject = [
  "$socketFactory"
  "$log"
]
