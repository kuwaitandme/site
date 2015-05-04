exports = module.exports = (knex, cache) -> new class
  constructor: ->
    bookshelf = (require "bookshelf") knex
    @model      = bookshelf.Model.extend tableName: "users"
    @collection = bookshelf.Collection.extend model: @model


  query: (parameters, callback=->) ->
    @collection.forge parameters
      .query().then (users) -> callback null, users


  findOne: (parameters={}, callback=->) ->
    @model.forge parameters
      .fetch().then (user) -> callback null, user


  get: (id, callback=->) ->
    @findOne { id: id }, (error, user) -> callback error, user


  create: (parameters, callback=->) ->
    newUser = parameters
    @model.forge newUser
      .save().then (user) -> callback null, user

  # Serialize and de-serialize functions for passport
  serialize: -> (user, callback) => callback null, user.id
  deserialize: -> (id, callback) => @get id, (err, user) -> callback err, user

exports["@singleton"] = true
exports["@require"] = [
  "igloo/knex"
  "controllers/cache"
]