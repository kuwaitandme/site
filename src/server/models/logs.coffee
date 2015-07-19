###*
 * The logs model is responsible for basically logging key actions with the
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
name = "[model:logs]"


exports = module.exports = (IoC, BaseModel, Enum) ->
  logger = IoC.create "igloo/logger"


  new class Logs extends BaseModel
    tableName: "logs"


    # Don't check for schema
    schema: false


    # Setup the enum types
    enums: types: tableName: "log_types", pick: "name"


    ###
      Logs an event in the database.

      @param {Express.req} request    The request object. (used to get the ip)
      @param {String} logType         The key of the log type name.
      @param {Object} data            A JSON object that will be attached to
                                      the event.
      @param {Bookshelf.Model} user   The user who should the log event be
                                      attached to.
      @return Promise                 A promise which resolves iff the log
                                      event could be created.
    ###
    log: (request, logType, data, user={}) ->
      logger.debug name, "logging event #{logType}"

      # First parse the data and populate the event's fields
      newEvent =
        ip: requestIp.getClientIp request
        type: @types[logType.toLowerCase()]
        user: (request.user and request.user.id) or user.id

      # For the data field, try to stringify the JSON so that psql stays happy.
      try if data? then newEvent.data = JSON.stringify data
      catch e

      # Create the log entry.
      @model.forge(newEvent).save()


      ###
        Query and return the last 300 events.

        @param  Object parameters    The parameters to query for.
        @return Promise              A promise which resolves with the collection
                                     of events.
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
          qb.orderBy "created_at", "DESC"

        # Finally execute the query.
        @collection.query(buildQuery).fetch()


exports["@require"] = [
  "$container"
  "models/base/model"
  "models/base/enum"
]
exports["@singleton"] = true
