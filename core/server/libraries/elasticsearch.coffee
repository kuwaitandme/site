exports = module.exports = (IoC, settings) ->
  new class ElasticSearch
    constructor: ->
      @client = global.elasticsearch
      @index = "bigindiannews"


    create: (type, id, body) ->
      @client.create index: @index, type: type, id: id, body: body


    update: (type, id, body) ->
      @client.update index: @index, type: type, id: id, body: doc: body


    search: (esDSL, page=0) ->
      page = Math.max (page - 1), 0
      esDSL.index = @index
      esDSL.size = 20 # 20 results per page
      esDSL.from = page * esDSL.size
      @client.search esDSL


exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true