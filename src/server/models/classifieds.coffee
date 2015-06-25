Promise           = require "bluebird"
_                 = require "underscore"
moment            = require "moment"
validator         = require "validator"
jsonValidator     = require("jsonschema").Validator

options =
  classifiedsPerPage: 30
  tableName: "classifieds"


POSTGRES_INT_MAX = 2147483647
POSTGRES_MAX_CHAR = 255

class ClassifiedValidator
  contactSchema:
    id: "/contact"
    type: "object"
    properties:
      email: type: "string", maxLength: 254
      phone: type: "string", maxLength: 140
      website: type: "string", maxLength: 2083

  metaSchema:
    id: "/meta"
    type: "object"
    properties:
      deliveryIncluded: type: "boolean"
      freeDeliveryIncluded: type: "boolean"
      gmapX: type: "float"
      gmapY: type: "float"
      hideEmail: type: "boolean"
      mapsEnabled: type: "boolean"
      promotePerk: type: "integer"
      shareSocial: type: "boolean"
      urgentPerk: type: "integer"
      viber: type: "boolean"
      whatsapp: type: "boolean"

  imageSchema:
    id: "/images"
    type: "object"
    properties:
      color: type: "string", maxLength: 7
      filename: type: "string", maxLength: 40
      height: type: "integer", minimum: 0, maximum: POSTGRES_INT_MAX
      main: type: "boolean"
      width: type: "integer", minimum: 0, maximum: POSTGRES_INT_MAX
    required: ["filename"]

  mainSchema:
    id: "/classified"
    type: "object"

    properties:
      child_category: type: "integer", minimum: 0, maximum: POSTGRES_INT_MAX
      contact: $ref: "/contact"
      created: type: "string", maxLength: POSTGRES_MAX_CHAR
      description: type: "string", minLength: 50, maxLength: 2000
      id: type: "integer", minimum: 0, maximum: POSTGRES_INT_MAX
      images: type: "array", items: $ref: "/images"
      language: type: "integer", minimum: 0, maximum: 2
      location: type: "integer", minimum: 0, maximum: POSTGRES_INT_MAX
      meta: $ref: "/meta"
      owner: type: "integer", minimum: 0, maximum: POSTGRES_INT_MAX
      parent_category: type: "integer", minimum: 0, maximum: POSTGRES_INT_MAX
      price_type: type: "integer", minimum: 0, maximum: 2
      price_value: type: "integer", minimum: 0, maximum: POSTGRES_INT_MAX
      slug: type: "string", maxLength: POSTGRES_MAX_CHAR
      status: type: "integer", minimum: 0, maximum: 7
      title: type: "string", minLength: 20, maxLength: 140
      type: type: "integer", minimum: 0, maximum: 0
      weight: type: "integer", minimum: 0, maximum: POSTGRES_INT_MAX

    required: [
      "description", "location", "parent_category", "price_type", "title"
    ]

  constructor: ->
    @v = new jsonValidator
    @v.addSchema @contactSchema, "/contact"
    @v.addSchema @metaSchema, "/meta"
    @v.addSchema @imageSchema, "/images"


  validate: (json) ->
    results = @v.validate json, @mainSchema
    try
      console.log json.price_value
      if json.price_type is 2 and (not price_value? or
      price_value <= 0)
        results.valid = false
        error = new Error "must not be empty when instance.price_type is CUSTOM"
        error.property = "instance.price_value"
        results.errors.push error
    catch e
    results


  # # These are all the fields that are valid columns in the table
  # fields: [
  #   "child_category", "contact", "created", "description"
  #   "images", "language", "location", "meta", "owner"
  #   "parent_category", "price_type", "price_value", "slug"
  #   "status", "title", "type", "weight", "id"
  # ]

  # # These are all the fields that are compulsory for a classified
  # # submitted by the user
  # requiredFields: [
  #   "description", "location", "parent_category", "price_type", "title"
  # ]

  # # These are all the fields that must not be changed once the model has
  # # been saved once in the database
  # finalFields: ["id", "owner", "slug", "created"]
  # jsonFields:
  #   images:
  #     color: String
  #     filename: String
  #     height: Number
  #     main: Boolean
  #   contact:
  #     address1: String
  #     address2: String
  #     email: String
  #     phone: String
  #     website: String
  #   meta:
  #     shareSocial: Boolean
  #     gmapX: Number
  #     gmapY: Number


  # constructor: (classified) -> @data = classified

  # # Returns properly iff the classified is valid. Throws an Error otherwise
  # # with the description of the error
  # isValid: ->
  #   if not @data? then throw new Error "missing classified"
  #   for requiredField in @requiredFields
  #     if not @data[requiredField]?
  #       throw new Error "missing #{requiredField}"

  #   if not validator.isLength @data.description, 50, 2000
  #    throw new Error "description bad length"

  #   if not validator.isLength @data.title, 20, 140
  #     throw new Error "title bad length"


classifiedValidator = new ClassifiedValidator

exports = module.exports = (knex) ->
  bookshelf = (require "bookshelf") knex
  model = bookshelf.Model.extend tableName: options.tableName
  collection = bookshelf.Collection.extend model: model

  classifiedsPerPage = 30


  Classified = new class Model
    classifiedsPerPage: 30

    # These are all the fields that are valid columns in the table
    fields: [
      "child_category", "contact", "created", "description"
      "images", "language", "location", "meta", "owner"
      "parent_category", "price_type", "price_value", "slug"
      "status", "title", "type", "weight", "id"
    ]

    # These are all the fields that are compulsory for a classified
    # submitted by the user
    requiredFields: [
      "description", "location", "parent_category", "price_type", "title"
    ]

    # These are all the fields that must not be changed once the model has
    # been saved once in the database
    finalFields: ["id", "owner", "slug", "created"]
    jsonFields: ["images", "meta", "contact"]


    isValid: (data) ->
      result = classifiedValidator.validate data
      if not result.valid and result.errors
        error = result.errors[0]
        error.message = "#{error.property} #{error.message}"
        console.log error
        throw result.errors[0]
      # console.log result


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

    prices:
      FREE: 0
      CONTACT_OWNER: 1
      CUSTOM: 2

    # # Returns properly iff the classified is valid. Throws an Error otherwise
    # # with the description of the error
    # isValid: (classified) ->
    #   if not classified? then throw new Error "missing classified"
    #   for requiredField in @requiredFields
    #     if not classified[requiredField]?
    #       throw new Error "missing #{requiredField}"

    #   if not validator.isLength classified.description, 50, 2000
    #    throw new Error "description bad length"

    #   if not validator.isLength classified.title, 20, 140
    #     throw new Error "title bad length"


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
        # qb.orderBy "weight", "DESC"
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
