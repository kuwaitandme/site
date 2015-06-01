exports = module.exports = ($socketFactory, console) -> new class
  @name: "[socket]"

  constructor: ->
    console.log @name, "initializing"
    # iosocket = io.connect "/"
    socket = socketFactory ioSocket: myIoSocket

exports.$inject = [
  "$socketFactory"
  "$log"
]
