###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise           = require "bluebird"
_                 = require "underscore"
jsonValidator     = require("jsonschema").Validator
moment            = require "moment"
traverse          = require "traverse"
validator         = require "validator"
xss               = require "xss"
Bookshelf         = require "bookshelf"

TABLENAME = "classifieds"
CLASSIFIEDS_PER_PAGE = 30
POSTGRES_INT_MAX = 2147483647
POSTGRES_MAX_CHAR = 255

###*
 * [classifiedSchema description]
 * @type {class}
###
classifiedSchema = new class ClassifiedSchema
  # These are all the fields that are valid columns in the table
  fields: [
    "child_category", "contact", "created", "description"
    "images", "language", "location", "meta", "owner"
    "parent_category", "price_type", "price_value", "slug"
    "status", "title", "type", "weight", "id"
  ]

  # Schema for the contact:[] field
  contactSchema:
    id: "/contact"
    type: "object"
    properties:
      email: type: "string", maxLength: 254
      phone: type: "string", maxLength: 140
      website: type: "string", maxLength: 2083

  # Schema for the meta:{} field
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

  # Schema for the image:[] field
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

  # The main schema for the classified
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


  ###*
   * [validate description]
   *
   * @param  {[type]} json [description]
   * @return {[type]}      [description]
  ###
  validate: (json) ->
    # Validate first based on the schema
    results = @v.validate json, @mainSchema

    # Then validate based on any custom rules
    try
      # If price_type is CUSTOM then price_value must be set
      if json.price_type is 2 and (not price_value? or
      price_value <= 0)
        results.valid = false
        error = new Error "must not be empty when instance.price_type is CUSTOM"
        error.property = "instance.price_value"
        results.errors.push error
    catch e

    # Now if there is an error, then throw the first one we find.
    if not results.valid and results.errors
      error = results.errors[0]
      error.message = "#{error.property} #{error.message}"
      throw results.errors[0]


  ###*
   * [clean description]
   *
   * @param  JSON json         The classified object that is to be cleaned
   * @return JSON              The result after cleaning the object
  ###
  clean: (json) ->
    # First pick out only the necessary fields, removing unwanted ones
    json = @filter json

    # Traverse through each key that is a string and perform an XSS filter on it
    traverse json
    .forEach (value) -> if typeof value is "string" then value = xss value

    # Return the cleaned object
    json

  filter: (json) -> _.pick json, (value, key, object) => key in @fields


exports = module.exports = (knex) ->
  bookshelf = Bookshelf knex
  model = bookshelf.Model.extend tableName: TABLENAME
  collection = bookshelf.Collection.extend model: model

  classifiedsPerPage = 30


  new class Model
    classifiedsPerPage: 30



    constructor: ->
      bookshelf = (require "bookshelf") knex
      @model      = bookshelf.Model.extend
        tableName: TABLENAME
        defaults: slug: "", status: 0
      @collection = bookshelf.Collection.extend model: @model


    # These are ports for the classified schema class..
    clean: (json) -> classifiedSchema.clean json
    filter: (json) -> classifiedSchema.filter json
    validate: (json) -> classifiedSchema.validate json


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


    ###*
     * [query description]
     *
     * @param  {[type]} parameters [description]
     * @return {[type]}            [description]
    ###
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

        qb.limit CLASSIFIEDS_PER_PAGE
        qb.offset (page - 1) * CLASSIFIEDS_PER_PAGE
        # qb.orderBy "weight", "DESC"
        qb.orderBy "created", "DESC"

      model.query(buildQuery).fetchAll()


    ###*
     * [getParentCategoryCount description]
     *
     * @return {[type]} [description]
    ###
    getParentCategoryCount: ->
      buildQuery = (qb) =>
        qb.select "parent_category as id"
        qb.count "parent_category"
        qb.where "status", @statuses.ACTIVE
        qb.groupBy "parent_category"

      model.query(buildQuery).fetchAll()


    ###*
     * [getChildCategoryCount description]
     *
     * @return {[type]} [description]
    ###
    getChildCategoryCount: ->
      buildQuery = (qb) =>
        qb.select "child_category as id"
        qb.count "child_category"
        qb.groupBy "child_category"
        qb.where "status", @statuses.ACTIVE

      model.query(buildQuery).fetchAll()


    ###*
     * [findNeighbouring description]
     *
     * @param  {[type]} id                 [description]
     * @param  {[type]} parameters={}    [description]
     * @param  {[type]} searchForward=true [description]
     * @return {[type]}                    [description]
    ###
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


    ###*
     * [get description]
     *
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
    ###
    get: (id) -> model.forge(id: id).fetch()


    ###*
     * [getBySlug description]
     *
     * @param  {[type]} slug [description]
     * @return {[type]}      [description]
    ###
    getBySlug: (slug) -> model.forge(slug: slug).fetch()


    ###*
     * [create description]
     *
     * @param  {[type]} parameters [description]
     * @return {[type]}            [description]
    ###
    create: (parameters) -> model.forge(@filter parameters).save()


    ###*
     * [patch description]
     *
     * @param  {[type]} id         [description]
     * @param  {[type]} parameters [description]
     * @return {[type]}            [description]
    ###
    patch: (id, parameters) -> model.forge(id: id).save parameters


    ###*
     * [calculateDaysActive description]
     *
     * @param  {[type]} perkName [description]
     * @param  {[type]} credits  [description]
     * @return {[type]}          [description]
    ###
    calculateDaysActive: (perkName, credits) ->
      switch perkName
        when "urgent" then credits/10
        when "promote" then credits/20
        else 0


exports["@require"] = ["igloo/knex"]
exports["@singleton"] = true
