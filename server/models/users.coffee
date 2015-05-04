exports = module.exports = (knex, cache) -> new class
  constructor: ->
    bookshelf = (require "bookshelf") knex
    @model      = bookshelf.Model.extend tableName: "users"
    @collection = bookshelf.Collection.extend model: @model


  query: (parameters, callback) ->
    @collection.forge parameters
      .query().then (categories={}) -> callback null, categories


  get: (id, callback) ->
    @model.forge id: id
      .fetch().then (category={}) -> callback null, category


exports["@singleton"] = true
exports["@require"] = [
  "igloo/knex"
  "controllers/cache"
]