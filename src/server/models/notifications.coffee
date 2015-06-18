Promise   = require "bluebird"
bCrypt    = require "bcrypt-nodejs"
requestIp = require "request-ip"
validator = require "validator"

exports = module.exports = (IoC, knex, io) ->
  logger = IoC.create "igloo/logger"
  name = "[model:notifications]"

  notificationsPerPage = 30

  bookshelf   = (require "bookshelf") knex
  model      = bookshelf.Model.extend tableName: "notifications"
  collection = bookshelf.Collection.extend model: model


  new class Notification

    ###
      Creates a new notification in the Database
    ###
    create: (request={}, message, data, user={}) ->
      logger.debug name, "creating notification: '#{message}'"
      userID = (request.user and request.user.id) or user.id
      newNotification =
        message: message
        user: userID
        data: data

      # With the naming convention we use, we relay the notification using
      # websockets back to the user..
      io.to("user:#{userID}").emit "notifications", newNotification

      # Then we save the actual notification in the DB
      model.forge(newNotification).save()


    ###
      Query the notifications in the DB with the given parameters
    ###
    query: (parameters) ->
      buildQuery = (qb) ->
        # Helper function to check if the number is a valid int
        _validInt = (i) -> i? and validator.isInt i, min: 0

        page = parameters.page
        if not _validInt page then page = 1

        hasRead = parameters.hasRead
        if hasRead in ["0", "1"] then qb.where "hasRead", hasRead

        user = parameters.user
        if _validInt user then qb.where "user", user

        qb.limit notificationsPerPage
        qb.offset (page - 1) * notificationsPerPage
        qb.orderBy "timestamp", "DESC"

      model.query(buildQuery).fetchAll()


    ###
      Updates the notifications with the given user id
    ###
    patch: (id, parameters) ->
      knex "notifications"
      .where "user", "=", id
      .update parameters


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/knex"
  "controllers/io"
]
