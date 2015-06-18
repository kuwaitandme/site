Promise           = require "bluebird"
_                 = require "underscore"
moment            = require "moment"
validator         = require "validator"


exports = module.exports = (knex) ->
  bookshelf = (require "bookshelf") knex
  model = bookshelf.Model.extend
    tableName: "classifieds", defaults: slug: "", status: 0
  collection = bookshelf.Collection.extend model: @model

  classifiedsPerPage = 30


  new class Model
    classifiedsPerPage: 30

    # These are all the fields that are valid columns in the table
    fields: [
      "child_category", "contact", "created", "description"
      "images", "language", "location", "meta", "owner"
      "parent_category", "price_type", "price_value", "slug"
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
      ARABIC: 2
      HINDI: 3


    evaluatePerks: (cl, user, perks) ->
      if not (perks.urgent? or perks.promote?) then return cl
      # Get the credits to be spent for each perk
      creditsToSpendForUrgent = Number perks.urgent or 0
      creditsToSpendForPromote = Number perks.promote or 0
      # Find out the total credits that will get spent
      creditsToSpend = creditsToSpendForPromote + creditsToSpendForUrgent
      # Check if the user has enough credits
      if creditsToSpend > user.credits then throw new Error "not enough credits"
      # Now update the perks taking care of any previous values.
      if creditsToSpendForUrgent > 0
        offset = moment cl.meta.urgentPerk
        # Calculate how many days the classified should be urgent
        urgentDays = creditsToSpendForUrgent / 20
        # Calculate and update the new expiry date
        newDate = offset.add urgentDays, "days"
        cl.meta.urgentPerk = newDate.valueOf()
      if creditsToSpendForPromote > 0
        cl.weight = 10
        offset = moment cl.meta.promotePerk
        # Calculate how many days the classified should be promoted
        promoteDays = creditsToSpendForPromote / 10
        # Calculate the and update the new expiry date
        newDate = offset.add promoteDays, "days"
        cl.meta.promotePerk = newDate.valueOf()
      # Perks have been updated and their expiry dates have been set. So now
      # return the modified the classified object.
      cl



    query: (parameters) ->
      buildQuery = (qb) ->
        # Helper function to check if the number is a valid int
        validInt = (i) -> i? and validator.isInt i, {min: 0}

        pcat = parameters.parent_category
        if validInt pcat then qb.where "parent_category", pcat

        ccat = parameters.child_category
        if validInt ccat then qb.where "child_category", ccat

        owner = parameters.owner
        if validInt owner then qb.where "owner", owner

        status = parameters.status
        if validInt status then qb.where "status", status

        page = parameters.page
        if not validInt page then page = 1

        # This subquery makes sure that only users that are ACTIVE have their
        # classifieds being queried..
        qb.whereRaw "owner in (
            SELECT u.id FROM users AS u
              WHERE u.status = 1
          )"

        qb.limit classifiedsPerPage
        qb.offset (page - 1) * classifiedsPerPage
        qb.orderBy "weight", "DESC"
        qb.orderBy "created", "DESC"

      model.query(buildQuery).fetchAll()


    getParentCategoryCount: ->
      buildQuery = (qb) =>
        qb.select "parent_category as id"
        qb.count "parent_category"
        qb.where "status", @statuses.ACTIVE
        qb.groupBy "parent_category"

      model.query(buildQuery).fetchAll()


    getChildCategoryCount: ->
      buildQuery = (qb) =>
        qb.select "child_category as id"
        qb.count "child_category"
        qb.groupBy "child_category"
        qb.where "status", @statuses.ACTIVE

      model.query(buildQuery).fetchAll()


    findNeighbouring: (id, parameters={}, searchForward=true) ->
      buildQuery = (qb) =>
        # Helper function to check if the number is a valid int
        validInt = (i) -> i? and validator.isInt i, {min: 0}

        owner = parameters.owner
        if validInt owner then qb.where "owner", owner

        status = parameters.status
        if validInt status then qb.where "status", status

        if searchForward then qb.where "id", ">", id
        else qb.where "id", "<", id

        qb.limit 1

      model.query(buildQuery).fetchAll()


    get: (id) -> model.forge(id: id).fetch()


    getBySlug: (slug) -> model.forge(slug: slug).fetch()


    create: (parameters) -> model.forge(@filter parameters).save()


    patch: (id, parameters) -> model.forge(id: id).save parameters


    calculateDaysActive: (perkName, credits) ->
      switch perkName
        when "urgent" then credits/10
        when "promote" then credits/20
        else 0



    filter: (data) -> _.pick data, (value, key, object) => key in @fields


exports["@require"] = ["igloo/knex"]
exports["@singleton"] = true
