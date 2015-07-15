Bookshelf         = require "bookshelf"


exports = module.exports = (knex, Cache) ->
  bookshelf  = Bookshelf knex

  ###
    @todo have checks for get, patch, etc..
  ###
  class Model
    constructor: (tableName) ->
      @model = bookshelf.Model.extend tableName: tableName
      return @model.forge({}).query()


exports["@require"] = [
  "igloo/knex"
  "libraries/cache"
]
exports["@singleton"] = true
