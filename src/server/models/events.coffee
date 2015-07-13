###*
 * The events model is responsible for basically logging key actions with the
 * site. Things like login, logout, creating classifieds etc get logged into
 * the DB for record-sake.
 *
 * An event object contains a timestamp and the ip address of the user who
 * initiated the event.
 *
 * @author Steven Enamakel <me@steven.pw>
###

Promise   = require "bluebird"
requestIp = require "request-ip"
validator = require "validator"
TABLENAME = "events"


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


name = "[model:events]"
exports = module.exports = (IoC, knex) ->
  logger = IoC.create "igloo/logger"

  bookshelf   = (require "bookshelf") knex
  model      = bookshelf.Model.extend tableName: TABLENAME
  collection = bookshelf.Collection.extend model: model


  class Model
    ###*
     * Logs an event in the database.
     *
     * @param  Express.req request     The request object. (used to get the ip)
     * @param  String eventName        The key of the event name (As the enum
     *                                 above).
     * @param  Object data             A JSON object that will be attached to
     *                                 the event.
     * @param  Bookshelf.model user    The user who should the event be attached
     *                                 to.
     * @return Promise                 A promise which resolves iff the event
     *                                 could be created.
    ###
    log: (request, eventName, data, user={}) ->
      logger.debug name, "logging event #{eventName}"

      # First parse the data and populate the event's fields
      newEvent =
        ip: requestIp.getClientIp request
        type: enums[eventName]
        user: (request.user and request.user.id) or user.id

      # For the data field, try to stringify the JSON so that psql stays happy.
      try if data? then newEvent.data = JSON.stringify data
      catch e

      # Create the event.
      model.forge(newEvent).save()


    ###*
     * Query and return the last 300 events.
     *
     * @param  Object parameters    The parameters to query for.
     * @return Promise              A promise which resolves with the collection
     *                              of events.
    ###
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

      # Finally execute the query.
      collection.query(buildQuery).fetch()

  new Model


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/knex"
]
