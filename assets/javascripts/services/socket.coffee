exports = module.exports = ($socketFactory) -> new class
  @name: "[socket]"

  constructor: ->
    console.log @name, "initializing"
    # iosocket = io.connect "/"
    socket = socketFactory ioSocket: myIoSocket

exports.$inject = ["$socketFactory"]