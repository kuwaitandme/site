bCrypt    = require "bcrypt-nodejs"
validator = require "validator"

exports = module.exports = (knex, cache) -> new class
  constructor: ->
    bookshelf = (require "bookshelf") knex
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
    newUser = parameters
    @model.forge newUser
      .save().then (user) -> callback null, user


  # Creates a user with the given email, with a temporary password
  createTemporary: (email, callback=->) ->
    newUser =
      full_name: "Anonymous"
      email: email
      password: @_randomPassword()
    @create newUser, callback


  # Function to create/validate hashed password
  isPasswordValid: (password1, password2) ->
    try return bCrypt.compareSync password1, password2
    catch e then return false
  hashPassword: (password) ->
    bCrypt.hashSync password, (bCrypt.genSaltSync 10), null


  # Serialize and de-serialize functions for passport
  serialize: -> (user, callback) => callback null, user.id
  deserialize: -> (id, callback) => @get id, (err, user) -> callback err, user


  # Helper function to create a random password
  _randomPassword: ->
    s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
    "#{s4()}-#{s4()}-#{s4()}"


exports["@singleton"] = true
exports["@require"] = [
  "igloo/knex"
  "controllers/cache"
]