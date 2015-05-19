bCrypt    = require "bcrypt-nodejs"
validator = require "validator"

exports = module.exports = (IoC, knex, cache) ->
  logger = IoC.create "igloo/logger"
  new class
    name: "[model:users]"
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
      @model      = bookshelf.Model.extend tableName: "users"
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


    # Creates a user with the given email, with a temporary password
    createTemporary: (email, newPassword, callback=->) ->
      @findOne { email: email }, (error, user) =>
        if error then return callback error
        if user then return callback new Error "email conflict"

        newUser =
          email: email
          full_name: "Anonymous"
          login_providers: email: email
          password: @hashPassword newPassword
          meta: hasTemporaryPassword: true
          status: @statuses.ACTIVE
        logger.debug @name, "creating temporary user with properties", newUser
        @create newUser, callback


    # Predicate functions for the different enum fields.
    isAdmin: (user) -> user.role is @roles.ADMIN
    isModerator: (user) -> user.role is @roles.MODERATOR

    isActive: (user) -> user.status is @statuses.ACTIVE
    isBanned: (user) -> user.status is @statuses.BANNED
    isInactive: (user) -> user.status is @statuses.INACTIVE
    isSuspended: (user) -> user.status is @statuses.SUSPENDED

    # usesGoogle: (user) -> false
    # usesFacebook: (user) -> false
    # usesTwitter: (user) -> false


    # Function to create/validate hashed password
    isPasswordValid: (password1, password2) ->
      try return bCrypt.compareSync password1, password2
      catch e then return false
    hashPassword: (password) ->
      bCrypt.hashSync password, (bCrypt.genSaltSync 10), null


    # Serialize and de-serialize functions for passport
    serialize: -> (user, callback) => callback null, user.id
    deserialize: -> (id, callback) => @get id, (err, user) -> callback err, user


    patch: (id, parameters, callback) ->
      logger.debug @name, "patching user with parameters", parameters
      @model.forge id: id
        .save parameters#, patch: true
        .then (classified) -> callback null, classified


    # Helper function to create a random password
    randomPassword: ->
      s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
      "#{s4()}-#{s4()}-#{s4()}"


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/knex"
  "controllers/cache"
]