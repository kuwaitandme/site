validator = require "validator"
TABLENAME = "transactions"


states =
  CREATED:   0
  APPROVED:  1
  EXECUTED:  2
  CANCELLED: 3


exports = module.exports = (IoC, knex) ->
  logger = IoC.create "igloo/logger"

  bookshelf   = (require "bookshelf") knex
  model      = bookshelf.Model.extend tableName: "transactions"
  collection = bookshelf.Collection.extend model: model

  class Model


    query: (parameters) -> collection.forge parameters.query()


    findOne: (parameters={}) -> model.forge(parameters).fetch()


    get: (id) -> Model.findOne {id: id}


    create: (parameters) -> model.forge(parameters).save()


    patch: (id, parameters) -> model.forge(id: id).save parameters



exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/knex"
]
