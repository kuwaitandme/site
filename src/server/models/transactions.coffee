validator = require "validator"

exports = module.exports = (IoC, knex) ->
  logger = IoC.create "igloo/logger"
  new class
    name: "[model:transaction]"
    loginStrategies:
      EMAIL:       0
      FACEBOOK:    1
      TWITTER:     2
      YAHOO:       3
      GOOGLEPLUS:  4
      PHONEGAP:    5

    roles:
      NORMAL:    0
      MODERATOR: 1
      ADMIN:     2

    statuses:
      INACTIVE:   0
      ACTIVE:     1
      BANNED:     2
      SUSPENDED:  3


    constructor: ->
      bookshelf   = (require "bookshelf") knex
      @model      = bookshelf.Model.extend tableName: "transactions"
      @collection = bookshelf.Collection.extend model: @model


    # Queries all the users that matches the given parameters
    query: (parameters, callback=->) ->
      @collection.forge parameters
        .query().then (users) -> callback null, users


    # Finds a specific user with the given parameters
    findOne: (parameters={}, callback=->) ->
      @model.forge parameters
        .fetch().then (user) -> callback null, user


    # Fetchs a user, but unlike findOne this takes in only an id.
    get: (id, callback=->) ->
      @findOne { id: id }, (error, user) -> callback error, user


    # Creates a new user
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