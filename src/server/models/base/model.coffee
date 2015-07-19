Bookshelf         = require "bookshelf"
Promise           = require "bluebird"
_                 = require "underscore"
moment            = require "moment"
traverse          = require "traverse"
validator         = require "validator"
xss               = require "xss"

Schema    = require "./schema"


exports = module.exports = (knex) ->
  bookshelf  = Bookshelf knex


  bookshelf.Model = bookshelf.Model.extend
    hasTimestamps: true

    permittedAttributes: -> _.keys schema.tables[@tableName]

    defaults: -> uuid: uuid.v4()


  ###
    @todo have checks for get, patch, etc..
  ###
  class Model extends Schema
    # The default values
    defaults: {}

    tableName: ""

    # Give a clean bookshelf instance, just in case we would need one without
    # all our modifications.
    bookshelf: Bookshelf knex


    constructor: ->
      # Initialize the schema.
      super()

      # Load the Bookshelf registry plugin, which helps us avoid circular
      # dependencies.
      @bookshelf.plugin "registry"

      # Load the the app's pagination plugin, which gives us the `fetchPage`
      # method on Models.
      @bookshelf.plugin require "./pagination"


      # @bookshelf.plugin require "./validation"

      # Create the model and collection instances.
      @model = bookshelf.Model.extend
        tableName: @tableName
        # initialize: -> @on "saving", @validateSchema

      @collection = bookshelf.Collection.extend model: @model


    ###
      Queries all the rows and finds the first matching row that matches the
      values in the parameters.

      TODO: Fix for sqlinjection

      @param {Object} parameters           The parameter with which we should
                                           query the DB.
      @return {Promise(Bookshelf.Model)}   A promise which resolves to the
                                           matching rows.
    ###
    findOne: (parameters={}) -> @model.forge(parameters).fetch()


    ###
     [get description]

     @param {[type]} id [description]
     @return {[type]}    [description]
     @todo fix sql injection
    ###
    get: (id) -> @findOne(id: id)


    ###
      [getBySlug description]

      @param {[type]} slug [description]
      @return {[type]}      [description]
      @todo fix sql injection
    ###
    getBySlug: (slug) -> @model.forge(slug: slug).fetch()


    ###
      [create description]

      @param  {[type]} parameters [description]
      @return {[type]}            [description]
    ###
    create: (parameters) -> @model.forge(@filter parameters).save()


    ###
      [patch description]

      @param  {[type]} id         [description]
      @param  {[type]} parameters [description]
      @return {[type]}            [description]
    ###
    patch: (id, parameters) -> @model.forge(id: id).save parameters


    ###
      @todo have each fn implement it's own query fn
    ###
    query: (parameters) -> @collection.forge({}).query()


exports["@require"] = ["igloo/knex"]
exports["@singleton"] = true
