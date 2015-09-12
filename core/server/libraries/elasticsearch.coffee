exports = module.exports = (IoC, settings) ->
  new class
    constructor: ->
      @client = global.elasticsearch
      @index = "bigindiannews"


    create: (type, id, body) ->
      @client.create
        index: @index
        type: type
        id: id
        body: body


    # search: (type) ->


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/settings"
]