bCrypt    = require 'bcrypt-nodejs'
async     = require 'async'
mongoose  = require 'mongoose'
util      = require 'util'
validator = require 'validator'

Schema    = mongoose.Schema
ObjectId  = Schema.ObjectId


# The model for representing a classified.
#
# As you can see this is probably the heaviest model among them all as the
# classified is the core of the app. There are function for creating, searching
# modifying the status, updating etc..
classifieds = module.exports =
  model: mongoose.model 'classified',
    ip:            String
    timestamp:     Date
    isBlacklisted: true
    data:        { }

  # Gets a single classified, given it's id. Returns an error if the id is
  # invalid or empty.
  get: (id, callback) ->
    if not validator.isMongoId id
      error = new Error "bad/empty id"
      error.status = 400
      return callback error

    @model.findOne { _id: id }, (error, result) ->
      if error then callback error
      else callback error, result