Promise   = require "bluebird"
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
    CLASSIFIED_MESSAGE: 7
    # Credit events
    CREDITS_EARNED: 8
    CREDITS_SPENT: 9
    # Transaction events
    TRANSACTION_SUCCESS: 10
    TRANSACTION_FAIL: 11


  new class
    # log the event in the database
    log: (request, eventName, data, user={}) ->
      logger.debug name, "logging event #{eventName}"
      newEvent =
        ip: requestIp.getClientIp request
        type: enums[eventName]
        user: (request.user and request.user.id) or user.id
      if data? then newEvent.data = JSON.stringify data

      model.forge newEvent
      .save()


    query: (parameters) ->
      eventsPerPage = 300
      buildQuery = (qb) ->
        # Helper function to check if the number is a valid int
        _validInt = (i) -> i? and validator.isInt i, min: 0

        page = parameters.page
        if not _validInt page then page = 1

        qb.limit eventsPerPage
        qb.offset (page - 1) * eventsPerPage
        qb.orderBy "timestamp", "DESC"

      model.query(buildQuery).fetchAll()


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/knex"
]
