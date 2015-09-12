###*
 *
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

CLASSIFIEDS_PER_PAGE = 20
POSTGRES_INT_MAX = 2147483647
POSTGRES_MAX_CHAR = 255


###*
 * This class represents a classified's schema. It basically is responsible for
 * validating and cleaning classifieds..
###
exports = module.exports = (knex, BaseModel) ->
  class Model extends BaseModel
    tableName: "sharing_items"

    # Setup the enum types
    enums:
      categories: tableName: "sharing_categories", pick: "name"
      statuses: tableName: "sharing_item_statuses", pick: "name"

    ###*
     * Query the DB with the given parameters
     *
     * @param  Object parameters      The query parameters.
     *
     * @return Promise                A promise that resolves with the results
     *                                of the query.
    ###
    query2: (parameters) ->
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

        # # This subquery makes sure that only users that are ACTIVE have their
        # # items being queried..
        # qb.whereRaw "owner in (
        #     SELECT u.id FROM users AS u
        #       WHERE u.status = 1
        #   )"

        keywords = String parameters.keywords or ""
        keywordCount = 0
        for keyword in keywords.split " "
          if validator.isAlphanumeric keyword
            if keywordCount++ is 0 then qb.where "title", "like", "#{keyword}%"
            else qb.orWhere "title", "like", "#{keyword}%"

        qb.limit CLASSIFIEDS_PER_PAGE
        qb.offset (page - 1) * CLASSIFIEDS_PER_PAGE
        # qb.orderBy "weight", "DESC"

        sort = parameters.sort
        switch sort
          # Most Expensive
          when 2 then qb.orderBy "price_value", "DESC"
          # Cheapest
          when 3 then qb.orderBy "price_value", "ASC"
          # Latest
          else qb.orderBy "created", "DESC"

      super.query()


    ###*
     * [getParentCategoryCount description]
     *
     * @return {[type]} [description]
    ###
    getParentCategoryCount: ->
      buildQuery = (qb) =>
        qb.select "parent_category as id"
        qb.count "parent_category"
        # qb.where "status", @statuses.ACTIVE
        qb.groupBy "parent_category"
      @model.query(buildQuery).fetchAll()


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
        # qb.where "status", @statuses.ACTIVE
      @model.query(buildQuery).fetchAll()


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


  new Model

exports["@require"] = [
  "igloo/knex"
  "models/base/model"
]
exports["@singleton"] = true
