validator         = require "validator"
_                 = require "underscore"


exports = module.exports = (knex) -> new class
  classifiedsPerPage: 30
  fields: [
    "child_category", "contact", "created", "description"
    "images", "language", "location", "meta", "owner"
    "parent_category", "priceType", "priceValue", "slug"
    "status", "title", "type", "weight"
  ]


  constructor: ->
    bookshelf = (require "bookshelf") knex
    @model      = bookshelf.Model.extend
      tableName: "classifieds"
      defaults: slug: "", status: 0
    @collection = bookshelf.Collection.extend model: @model


  statuses:
    INACTIVE: 0
    ACTIVE: 1
    REJECTED: 2
    ARCHIVED: 3
    BANNED: 4
    FLAGGED: 5
    VERIFIED: 6
    EXPIRED: 7


  languages:
    ENGLISH: 1
    ARABIC:  2
    HINDI:   3


  query: (parameters, callback) ->
    buildQuery = (qb) =>
      # Helper function to check if the number is a valid int
      _validInt = (i) -> i? and validator.isInt i, { min: 0 }

      # parent category
      pcat = parameters.parent_category
      if _validInt pcat then qb.where "parent_category", pcat
      # child category
      ccat = parameters.child_category
      if _validInt ccat then qb.where "child_category", ccat
      # classified owner
      owner = parameters.owner
      if _validInt owner then qb.where "owner", owner
      # classifieds page no.
      page = parameters.page
      if not _validInt page then page = 1

      qb.limit @classifiedsPerPage
      qb.offset (page - 1) * @classifiedsPerPage
      qb.orderBy "created", "ASC"

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
    newClassified = @_filter parameters
    @model.forge newClassified
      .save().then (classified) -> callback null, classified


  patch: (id, parameters, callback) ->
    @model.forge id: id
      .save parameters#, patch: true
      .then (classified) -> callback null, classified


  _filter: (data) ->
    classified = _.pick data, (value, key, object) => key in @fields


exports["@require"] = ["igloo/knex"]
exports["@singleton"] = true