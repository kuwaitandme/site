Promise           = require "bluebird"
_                 = require "underscore"
validator         = require "validator"


exports = module.exports = (knex) ->
  bookshelf = (require "bookshelf") knex
  model = bookshelf.Model.extend
    tableName: "classifieds", defaults: slug: "", status: 0
  collection = bookshelf.Collection.extend model: @model

  classifiedsPerPage = 30
  new class
    classifiedsPerPage: 30

    # These are all the fields that are valid columns in the table
    fields: [
      "child_category", "contact", "created", "description"
      "images", "language", "location", "meta", "owner"
      "parent_category", "priceType", "priceValue", "slug"
      "status", "title", "type", "weight", "id"
    ]

    # These are all the fields that must not be changed once the model has
    # been saved once in the database
    finalFields: ["id", "owner", "slug", "created"]
    jsonFields: ["images", "meta", "contact"]

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

    queryPromise: (parameters) ->
      new Promise (resolve, reject) =>
        buildQuery = (qb) =>
          # Helper function to check if the number is a valid int
          _validInt = (i) -> i? and validator.isInt i, { min: 0 }

          pcat = parameters.parent_category
          if _validInt pcat then qb.where "parent_category", pcat

          ccat = parameters.child_category
          if _validInt ccat then qb.where "child_category", ccat

          owner = parameters.owner
          if _validInt owner then qb.where "owner", owner

          status = parameters.status
          if _validInt status then qb.where "status", status

          page = parameters.page
          if not _validInt page then page = 1

          qb.limit classifiedsPerPage
          qb.offset (page - 1) * classifiedsPerPage
          qb.orderBy "weight", "DESC"
          qb.orderBy "created", "DESC"

        model.query buildQuery
          .fetchAll()
          .then (classifieds) -> resolve classifieds


    query: (parameters, callback) ->
      buildQuery = (qb) =>
        # Helper function to check if the number is a valid int
        _validInt = (i) -> i? and validator.isInt i, { min: 0 }

        pcat = parameters.parent_category
        if _validInt pcat then qb.where "parent_category", pcat

        ccat = parameters.child_category
        if _validInt ccat then qb.where "child_category", ccat

        owner = parameters.owner
        if _validInt owner then qb.where "owner", owner

        status = parameters.status
        if _validInt status then qb.where "status", status

        page = parameters.page
        if not _validInt page then page = 1

        qb.limit @classifiedsPerPage
        qb.offset (page - 1) * @classifiedsPerPage
        qb.orderBy "created", "DESC"

      @model.query buildQuery
        .fetchAll()
        .then (classifieds) -> callback null, classifieds


    getParentCategoryCount: (callback) ->
      buildQuery = (qb) =>
        qb.select "parent_category as id"
        qb.count "parent_category"
        qb.where "status", @statuses.ACTIVE
        qb.groupBy "parent_category"

      @model.query buildQuery
        .fetchAll()
        .then (counters={}) -> callback null, counters

    getChildCategoryCount: (callback) ->
      buildQuery = (qb) =>
        qb.select "child_category as id"
        qb.count "child_category"
        qb.groupBy "child_category"
        qb.where "status", @statuses.ACTIVE

      @model.query buildQuery
        .fetchAll()
        .then (counters) -> callback null, counters


    findNeighbouring: (id, parameters={}, searchForward=true) ->
      new Promise (resolve, reject) ->
        buildQuery = (qb) =>
          # Helper function to check if the number is a valid int
          _validInt = (i) -> i? and validator.isInt i, { min: 0 }
          owner = parameters.owner
          if _validInt owner then qb.where "owner", owner
          status = parameters.status
          if _validInt status then qb.where "status", status
          if searchForward then qb.where "id", ">", id
          else qb.where "id", "<", id
          qb.limit 1

        model.query buildQuery
          .fetchAll()
          .then (classifieds) -> resolve classifieds


    getPromise: (id) ->
      new Promise (resolve, reject) =>
        model.forge id: id
          .fetch().then (classified) -> resolve classified


    get: (id, callback) ->
      @model.forge id: id
        .fetch().then (classified) -> callback null, classified


    getBySlug: (slug, callback) ->
      @model.forge slug: slug
        .fetch().then (classified) -> callback null, classified


    create: (parameters, callback=->) ->
      newClassified = @filter parameters
      @model.forge newClassified
        .save().then (classified) -> callback null, classified

    createPromise: (parameters) ->
      newClassified = @filter parameters
      new Promise (resolve, reject) ->
        model.forge newClassified
          .save().then (classified) -> resolve classified


    patchPromise: (id, parameters) -> new Promise (resolve, reject) ->
      model.forge id: id
        .save parameters
        .then (classified) -> resolve classified


    patch: (id, parameters, callback) ->
      @model.forge id: id
        .save parameters#, patch: true
        .then (classified) -> callback null, classified


    calculateDaysActive: (perkName, credits) ->
      switch perkName
        when "urgent" then credits/10
        when "promote" then credits/20
        else 0



    filter: (data) -> _.pick data, (value, key, object) => key in @fields


exports["@require"] = ["igloo/knex"]
exports["@singleton"] = true