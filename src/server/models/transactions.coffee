validator = require "validator"

exports = module.exports = (IoC, knex) ->
  logger = IoC.create "igloo/logger"
  new class
    name: "[model:transaction]"
    states:
      CREATED:   0
      APPROVED:  1
      EXECUTED:  2
      CANCELLED: 3


    constructor: ->
      bookshelf   = (require "bookshelf") knex
      @model      = bookshelf.Model.extend tableName: "transactions"
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
      @model.forge parameters
        .save().then (user) -> callback null, user


    patch: (id, parameters, callback) ->
      logger.debug @name, "patching user with parameters", parameters
      @model.forge id: id
        .save parameters
        .then (classified) -> callback null, classified



exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/knex"
]