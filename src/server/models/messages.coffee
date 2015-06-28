Bookeshelf = require "bookshelf"
Promise    = require "bluebird"
validator  = require "validator"
xss        = require "xss"


TABLENAME = "messages"
MESSAGES_PER_PAGE = 20


exports = module.exports = (IoC, knex) ->
  bookshelf  = Bookeshelf knex
  model      = bookshelf.Model.extend tableName: TABLENAME
  collection = bookshelf.Collection.extend model: model



  validate = (data) -> new Promise (resolve, reject) ->
    if not validator.isEmail data.from_email then return reject "bad email"
    if not validator.isInt data.to_user, {min: 0}
      return reject "bad to_user"
    if from_user? and not validator.isInt data.from_user, {min: 0}
      return reject "bad from_user"
    # console.log data.message.length
    # if not validator.isLength data.message, {min: 10, max: 2000}
    #   return reject "bad message"
    if from_name? and not validator.isLength data.from_name, {min: 0, max: 140}
      return reject "bad from_name"

    # If everything was all good, then resolve with the data.
    resolve data


  clean = (data) ->
    if data.from_name? then data.from_name = xss data.from_name
    data.message = xss data.message.trim()
    Promise.resolve data


  new class Model


    create: (data) ->
      # Define the message with the required fields.
      newMessage =
        from_email: data.from_email or ""
        to_user: data.to_user
        message: data.message or ""

      # Conditional fields, set if defined
      if data.from_user? then newMessage.from_user = data.from_user
      if data.from_name? then newMessage.from_name = data.from_name

      # Now first clean and then validate the message
      clean(newMessage).then validate

      # Then save it into the DB
      .then (message) -> model.forge(message).save()


    query: (parameters) ->
      buildQuery = (qb) ->
        # Helper function to check if the number is a valid int
        _validInt = (i) -> i? and validator.isInt i, min: 0

        page = parameters.page
        if not _validInt page then page = 1

        qb.limit MESSAGES_PER_PAGE
        qb.offset (page - 1) * MESSAGES_PER_PAGE
        qb.orderBy "created", "DESC"

      model.query(buildQuery).fetchAll()


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/knex"
]
