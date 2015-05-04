exports = module.exports = (knex, cache) -> new class
  constructor: ->
    bookshelf = (require "bookshelf") knex
    @model      = bookshelf.Model.extend tableName: "categories"
    @collection = bookshelf.Collection.extend model: @model


  query: (parameters, callback) ->
    @collection.forge parameters
      .query().then (categories={}) -> callback null, categories


  get: (id, callback) ->
    @model.forge id: id
      .fetch().then (category={}) -> callback null, category


  getAll: (callback) ->
    # Check in cache
    cache.get "model:categories", (error, results) =>
      if results then return callback null, JSON.parse results

      # Categories was not cached, so query and then save in cache
      @query {}, (error, categories) ->
        json = JSON.stringify categories, null, 2
        cache.set "model:categories", json
        callback error, categories


exports["@singleton"] = true
exports["@require"] = [
  "igloo/knex"
  "controllers/cache"
]