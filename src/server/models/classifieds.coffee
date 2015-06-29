###*
 * This module is responsible for handling DB queries for classifieds.
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
CLASSIFIEDS_PER_PAGE = 20
POSTGRES_INT_MAX = 2147483647
POSTGRES_MAX_CHAR = 255

###*
 * This class represents a classified's schema. It basically is responsible for
 * validating and cleaning classifieds..
###
class ClassifiedSchema
  # Enum for the different statuses.
  statuses:
    INACTIVE: 0
    ACTIVE: 1
    REJECTED: 2
    ARCHIVED: 3
    BANNED: 4
    FLAGGED: 5
    VERIFIED: 6
    EXPIRED: 7

  # Enum for the different languages.
  languages:
    ENGLISH: 1
    ARABIC: 2
    HINDI: 3

  # Enum for the different prices.
  prices:
    FREE: 0
    CONTACT_OWNER: 1
    CUSTOM: 2

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
      dontShareSocial: type: "boolean"
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
      filename: type: "string", maxLength: 300
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


  # These are JSON fields
  jsonFields: ["contact", "images", "meta"]


  # These are fields that should not be changed
  finalFields: ["created", "id", "owner", "email"]

  # The default values
  defaults:
    contact: {}
    images: []
    meta: {}
    price_value: 0
    slug: ""
    status: 0
    weight: 0

  constructor: ->
    # Initialize the validator and attach our different schemas..
    @v = new jsonValidator
    @v.addSchema @contactSchema, "/contact"
    @v.addSchema @metaSchema, "/meta"
    @v.addSchema @imageSchema, "/images"

    # Grab the different fields from the schemas so that our filters can use
    # them later...
    @imageFields = do => key for key of @imageSchema.properties
    @metaFields = do => key for key of @metaSchema.properties
    @contactFields = do => key for key of @contactSchema.properties
    @mainFields = do => key for key of @mainSchema.properties


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
      if json.price_type is @prices.CUSTOM and (not json.price_value? or
      json.price_value <= 0)
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
   * Cleans a classified by performing XSS and key filters on it and also
   * applying any default values in case we expect any DB insertion errors.
   *
   * @param  JSON json         The classified object that is to be cleaned
   * @return JSON              The result after cleaning the object
  ###
  clean: (json) ->
    # First pick out only the necessary fields, removing unwanted ones
    filteredJSON = @filter json

    # Traverse through each key
    traverse filteredJSON
    .forEach (value) ->
      # If it is not defined then remove it.. (remove any annoying nulls..)
      if not value? then @remove()
      # If it is a string then perform an XSS filter on it
      else if typeof value is "string" then value = xss value

    # Apply the default values.
    finalJSON = {}
    _.extend finalJSON, @defaults, filteredJSON

    # Return the cleaned object
    finalJSON


  ###*
   * Filters the classified object and removes any unwanted fields.
   *
   * @param  Object json       A JSON of the classified
   * @return Object            A filtered object of the classified that has all
   *                           unwanted fields removed out.
  ###
  filter: (json) ->
    json = _.pick json, (v, key, o) => key in @mainFields

    # Because Underscore refuses to perform a deep pick/extend, we will have to
    # manually filter out all the sub-json fields..
    if json.images then for image in (json.images or [])
      image = _.pick image, (v, key, o) => key in @imageFields
    if json.meta
      json.meta = _.pick json.meta, (v, key, o) => key in @metaFields
    if json.contact
      json.contact = _.pick json.contact, (v, key, o) => key in @contactFields

    # This json has now been properly filtered. Return it.
    json


exports = module.exports = (knex) ->
  bookshelf = Bookshelf knex
  model = bookshelf.Model.extend tableName: TABLENAME
  collection = bookshelf.Collection.extend model: model

  new class Model extends ClassifiedSchema
    ###*
     * Query the DB with the given parameters
     *
     * @param  Object parameters      The query parameters.
     *
     * @return Promise                A promise that resolves with the results
     *                                of the query.
    ###
    query: (parameters) ->
      buildQuery = (qb) ->
        # Helper function to check if the number is a valid int
        validInt = (i) -> i? and validator.isInt i, {min: 0}

        pcat = parameters.parent_category
        if validInt pcat then qb.where "parent_category", pcat

        ccat = parameters.child_category
        if validInt ccat then qb.where "child_category", ccat

        location = parameters.location
        if validInt location then qb.where "location", location

        price_type = parameters.price_type
        if validInt price_type then qb.where "price_type", price_type

        price_value_min = parameters.price_value_min
        if validInt price_value_min
          qb.where "price_value", ">=", price_value_min

        price_value_max = parameters.price_value_max
        if validInt price_value_max
          qb.where "price_value", "<=", price_value_max

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

        keywords = String parameters.keywords or ""
        keywordCount = 0
        for keyword in keywords.split " "
          if validator.isAlphanumeric keyword
            if keywordCount++ is 0 then qb.where "title", "like", "#{keyword}%"
            else qb.orWhere "title", "like", "#{keyword}%"

        qb.limit CLASSIFIEDS_PER_PAGE
        qb.offset (page - 1) * CLASSIFIEDS_PER_PAGE
        # qb.orderBy "weight", "DESC"

        console.log qb.toString()
        sort = parameters.sort
        switch sort
          # Most Expensive
          when 2 then qb.orderBy "price_value", "DESC"
          # Cheapest
          when 3 then qb.orderBy "price_value", "ASC"
          # Latest
          else qb.orderBy "created", "DESC"

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


exports["@require"] = ["igloo/knex"]
exports["@singleton"] = true
