exports = module.exports = (knex, cache) -> new class
  constructor: ->
    bookshelf = (require "bookshelf") knex
    @model      = bookshelf.Model.extend tableName: "locations"
    @collection = bookshelf.Collection.extend model: @model


  query: (parameters, callback) ->
    @collection.forge parameters
      .query().then (locations={}) -> callback null, locations


  get: (id, callback) ->
    @model.forge id: id
      .fetch().then (location={}) -> callback null, location


  getAll: (callback) ->
    # Check in cache
    cache.get "model:locations", (error, results) =>
      if results then return callback null, JSON.parse results

      # locations was not cached, so query and then save in cache
      @query {}, (error, locations) ->
        json = JSON.stringify locations, null, 2
        cache.set "model:locations", json
        callback error, locations


exports["@singleton"] = true
exports["@require"] = [
  "igloo/knex"
  "controllers/cache"
]