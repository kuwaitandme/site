Promise   = require "bluebird"
bCrypt    = require "bcrypt-nodejs"
requestIp = require "request-ip"
validator = require "validator"

exports = module.exports = (IoC, knex) ->
  logger = IoC.create "igloo/logger"
  name = "[model:events]"

  bookshelf   = (require "bookshelf") knex
  model      = bookshelf.Model.extend tableName: "events"
  collection = bookshelf.Collection.extend model: model

  enums =
    # Login/Logout events
    LOGIN: 1
    LOGOUT: 2
    SIGNUP: 3
    # Classified events
    CLASSIFIED_CREATE: 4
    CLASSIFIED_EDIT: 5
    CLASSIFIED_DELETE: 6
    # Credit events
    CREDITS_EARNED: 7
    CREDITS_SPENT: 8
    # Transaction events
    TRANSACTION_SUCCESS: 7
    TRANSACTION_FAIL: 7


  new class
    # log the event in the database
    log: (request, eventName, data, user={}) ->
      logger.debug name, "logging event #{eventName}"
      newEvent =
        ip: requestIp.getClientIp request
        type: enums[eventName]
        user: (request.user and request.user.id) or user.id
      if data? then newEvent.data = JSON.stringify data
      new Promise (resolve, reject) ->
        model.forge newEvent
        .save().then (event) -> resolve event


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/knex"
]
