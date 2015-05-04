exports = module.exports = (knex) -> new class
  constructor: ->
    bookshelf = (require "bookshelf") knex
    @model      = bookshelf.Model.extend tableName: "classifieds"
    @collection = bookshelf.Collection.extend model: @model


  query: (parameters, callback) ->
    @collection.forge parameters
      .query().then (classifieds={}) -> callback null, classifieds


  get: (id, callback) ->
    @model.forge id: id
      .fetch().then (classified={}) -> callback null, classified


  getBySlug: (slug, callback) ->
    @model.forge slug: slug
      .fetch().then (classified={}) -> callback null, classified


  create: (parameters, callback=->) ->
    newClassified = parameters
    @model.forge newClassified
      .save().then (classified) -> callback null, classified

exports["@singleton"] = true
exports["@require"] = ["igloo/knex"]