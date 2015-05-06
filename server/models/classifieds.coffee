validator         = require "validator"


exports = module.exports = (knex) -> new class
  classifiedsPerPage: 30

  constructor: ->
    bookshelf = (require "bookshelf") knex
    @model      = bookshelf.Model.extend
      tableName: "classifieds"
      defaults: slug: "", status: 0
    @collection = bookshelf.Collection.extend model: @model


  query: (parameters, callback) ->
    buildQuery = (qb) =>
      pcat = parameters.parent_category
      if pcat? and validator.isInt pcat, { min: 0 }
        qb.where "parent_category", pcat

      ccat = parameters.child_category
      if ccat? and validator.isInt ccat, { min: 0 }
        qb.where "child_category", ccat

      page = parameters.page
      if not parameters.page? or not validator.isInt page, { min: 0 }
        page = 1

      qb.limit @classifiedsPerPage
      qb.offset (page - 1) * @classifiedsPerPage

    @model.query buildQuery
      .fetchAll()
      .then (classifieds={}) -> callback null, classifieds


  get: (id, callback) ->
    @model.forge id: id
      .fetch().then (classified={}) -> callback null, classified


  getBySlug: (slug, callback) ->
    @model.forge slug: slug
      .fetch().then (classified={}) -> callback null, classified


  create: (parameters, callback=->) ->
    newClassified = parameters
    @model.forge newClassified
      .save().then (classified) -> callback null, classified

  patch: (id, parameters, callback) ->
    @model.forge id: id
      .save parameters#, patch: true
      .then (classified) -> callback null, classified


exports["@require"] = ["igloo/knex"]
exports["@singleton"] = true