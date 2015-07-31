Bookshelf         = require "bookshelf"
Promise           = require "bluebird"
_                 = require "underscore"
moment            = require "moment"
randomstring      = require "randomstring"
slug              = require "slug"
traverse          = require "traverse"
validator         = require "validator"
xss               = require "xss"


Schema    = require "./schema"


exports = module.exports = (knex, Enum) ->

  bookshelf = Bookshelf knex


  ###
    @todo have checks for get, patch, etc..
  ###
  class Model extends Schema
    # The default values
    defaults: {}

    tableName: ""

    # Give a clean bookshelf & knex instance, just in case we would need one
    # without all our modifications.
    bookshelf: bookshelf
    knex: knex


    # List of different enums
    enums: []

    constructor: ->
      # Initialize the schema.
      super()
      validateSchema = @validateSchema

      # Load the Bookshelf registry plugin, which helps us avoid circular
      # dependencies.
      @bookshelf.plugin "registry"

      # Load the the app's pagination plugin, which gives us the `fetchPage`
      # method on Models.
      @bookshelf.plugin require "./pagination"

      # Prepare the parameters we will extend
      self = this
      extendPrameters =
        tableName: @tableName
        hasTimestamps: true
        initialize: ->
          @on "saving", -> self.onSave this
          @on "creating", -> self.onCreate this
          @on "updating", -> self.onUpdate this
        validate: -> self.validateSchema @attributes or {}

      # Extend!
      if @extends? then extendPrameters = _.extend extendPrameters, @extends

      # Create the model and collection instances.
      @bookshelf.model @tableName, extendPrameters
      @model = @bookshelf.model @tableName
      @collection = @bookshelf.Collection.extend model: @model

      # Now assign all the different enums into the object
      for e of @enums then do (e) =>
        value = @enums[e]

        # Instantiate and read from the table first
        (new Enum value.tableName).then (json) =>
          # If a pick option was set, then start picking and then save it!
          if value.pick?
            picked = {}
            for item in json then picked[item[value.pick]] = item.id
            this[e] = picked

          # Else, directly save the JSON
          else this[e] = json

      # if @full_cache then do something

    onCreate: (model) -> null
    onUpdate: (model) -> null
    onSave: (model) -> null


    createSlug: (text="") ->
      slugText = "#{text} #{randomstring.generate 10}"
      slug slugText.toLowerCase()


    ###
      Queries all the rows and finds the first matching row that matches the
      values in the parameters.

      TODO: Fix for sqlinjection

      @param {Object} parameters           The parameter with which we should
                                           query the DB.
      @return {Promise(Bookshelf.Model)}   A promise which resolves to the
                                           matching rows.
    ###
    findOne: (parameters, options) -> @model.forge(parameters).fetch(options)


    ###
     [get description]

     @param {[type]} id [description]
     @return {[type]}    [description]
     @todo fix sql injection
    ###
    get: (id, options) -> @findOne(id: id, options)


    ###
      [getBySlug description]

      @param {[type]} slug [description]
      @return {[type]}      [description]
      @todo fix sql injection
    ###
    getBySlug: (slug, options) -> @model.forge(slug: slug).fetch(options)


    ###
      [create description]

      @param  {[type]} parameters [description]
      @return {[type]}            [description]
    ###
    # create: (parameters) -> @model.forge(@filter parameters).save()
    create: (parameters) -> @model.forge(parameters).save()


    ###
      [patch description]

      @param  {[type]} id         [description]
      @param  {[type]} parameters [description]
      @return {[type]}            [description]
    ###
    patch: (id, parameters) -> @model.forge(id: id).save parameters


    recent: (buildQuery, options={}) ->
      options.order = created_at: "DESC"
      @model.forge().fetchPage buildQuery, options


    ###
      @todo have each fn implement it's own query fn
    ###
    query: (buildQuery, options) -> @model.forge().fetchPage buildQuery, options


exports["@require"] = [
  "igloo/knex"
  "models/base/enum"
  "libraries/cache"
]
exports["@singleton"] = true
