###
  Pagination (Bookself plugin)

  Extends Bookshelf.Model with a `fetchPage` method. Handles everything to do
  with paginated requests.
###
_ = require "lodash"
Promise = require "bluebird"


###
  ## Default pagination values.
  These are overridden via `options` passed to each function.

  @typedef {Object} defaults
  @default
  @property {Number} `page` \- page in set to display (default: 1)
  @property {Number|String} `limit` \- no. results per page (default: 15)
###
defaults =
  limit: 20
  page: 1


###
  ## Pagination Utils

  @api private
  @type {{parseOptions: Function, query: Function, formatResponse: Function}}
###
paginationUtils =
  ###
    ## Parse Options
    Take the given options and ensure they are valid pagination options, else
    use the defaults.

    @param {options} options
    @returns {options} options sanitised for pagination
   ###
  parseOptions: (options) ->
    options = _.defaults options or {}, defaults
    if options.limit != "all"
      options.limit = parseInt(options.limit, 10) or defaults.limit
    options.page = parseInt(options.page, 10) or defaults.page
    options


  ###
    ## Query
    Apply the necessary parameters to paginate the query.

    @param {Bookshelf.Model, Bookshelf.Collection} itemCollection
    @param {options} options
   ###
  query: (itemCollection, options) ->
    if _.isNumber options.limit
      itemCollection.query "limit", options.limit
      .query "offset", options.limit * (options.page - 1)


  ###
    ## Format Response
    Takes the no. of items returned and original options and calculates all of
    the pagination meta data.

    @param {Number} totalItems
    @param {JSON} options
    @returns {JSON} pagination metadata
   ###
  formatResponse: (totalItems, options) ->
    calcPages = Math.ceil(totalItems / options.limit) or 0
    pagination =
      limit: options.limit
      next: null
      page: options.page or defaults.page
      pages: if calcPages is 0 then 1 else calcPages
      prev: null
      total: totalItems

    if pagination.pages > 1
      if pagination.page is 1
        pagination.next = pagination.page + 1
      else if pagination.page is pagination.pages
        pagination.prev = pagination.page - 1
      else
        pagination.next = pagination.page + 1
        pagination.prev = pagination.page - 1
    pagination


###
  ## Pagination Object

  @typedef {Object} pagination
  @property {Number} `page` \- page in set to display
  @property {Number|String} `limit` \- no. results per page, or 'all'
  @property {Number} `pages` \- total no. pages in the full set
  @property {Number} `total` \- total no. items in the full set
  @property {Number|null} `next` \- next page
  @property {Number|null} `prev` \- previous page
###

###
  ## Fetch Page Options

  @typedef {Object} options
  @property {Number} `page` \- page in set to display
  @property {Number|String} `limit` \- no. results per page, or 'all'
  @property {Object} `order` \- set of order by params and directions
###

###
  ## Fetch Page Response

  @typedef {Object} paginatedResult
  @property {Array} `collection` \- set of results
  @property {pagination} pagination \- pagination metadata
###


###
  ## Pagination

  Extends `bookshelf.Model` with `fetchPage`
  @api public
  @param {Bookshelf} bookshelf \- the instance to plug into
###
module.exports = pagination = (bookshelf) ->
  # Extend updates the first object passed to it, no need for an assignment
  _.extend bookshelf.Model.prototype, fetchPage: (buildQuery, options) ->
    buildQuery ?= ->

    # Setup pagination options
    options = paginationUtils.parseOptions options

    @resetQuery()
    @query buildQuery

    # Get the table name and idAttribute for this model
    tableName = _.result @constructor.prototype, "tableName"
    idAttribute = _.result @constructor.prototype, "idAttribute"
    collection = @constructor.collection()
    countPromise = @query().clone().count "#{tableName}.#{idAttribute} as
      aggregate"


    # Clone the base query into our collection
    collection.query buildQuery

    # Setup the pagination parameters so that we return the correct items from
    # the set
    paginationUtils.query collection, options

    # Apply ordering options if they are present
    # This is an optimization, adding order before cloning for the count query
    # would mean the count query was also ordered, when that is unnecessary.
    if options.order
      _.forOwn options.order, (direction, property) ->
        collection.query "orderBy", "#{tableName}.#{property}", direction

    if @relatedData then collection.relatedData = @relatedData

    # ensure that our model (self) gets the correct events fired upon it
    collection.on "fetching", (collection, columns, options) =>
      @triggerThen "fetching:collection", collection, columns, options
    .on "fetched", (collection, resp, options) =>
      @triggerThen "fetched:collection", collection, resp, options

    # Setup the promise to do a fetch on our collection, running the specified
    # query.
    #
    # @TODO: ensure option handling is done using an explicit pick elsewhere
    collectionPromise = collection.fetch _.omit options, ["page", "limit"]

    # Resolve the two promises
    Promise.join collectionPromise, countPromise
    .then (results) ->
      # Format the collection & count result into
      # `{collection: [], pagination: {}}`
      collection: results[0]
      pagination: paginationUtils.formatResponse results[1][0].aggregate,
        options
