###
BaseModel
=========

This file describes the baseModel for all the other models that will get used
in the side. This Model builds on top of `Bookshelf.Model` and provides easy
to use functions as well convience ones.
###
Bookshelf         = require "bookshelf"
Md5               = require "MD5"
Promise           = require "bluebird"
_                 = require "underscore"
moment            = require "moment"
randomstring      = require "randomstring"
slug              = require "slug"
traverse          = require "traverse"
validator         = require "validator"
xss               = require "xss"

Schema            = require "./schema"


BaseModel = (knex, Enum, Cache, Settings) ->
  class Model extends Schema
    ###
    **tableName** The name of the database table this model will attach to.
    ###
    tableName: ""


    ###
    **extends** Any custom extend parameters that get sent to the Bookshelf
    Model. Be careful not overwrite the `initialize` function because the
    alot of functionality might depend on the custom code written here for this
    model.

    You can mention things like relationships here like the example below.

    ```
    Model.extends =
      created_by: -> @belongsTo "users", "created_by"
      comments: -> @hasMany "comments", "story"
    ```
    ###
    extends: {}


    ###
    **knex** Give access to a knex instance, just in case we would need one without all
    our modifications to the Bookshelf functinos below.
    ###
    knex: knex


    fullCache: false
    enableMD5: false


    bookshelf: Bookshelf knex


    # List of different enums
    enums: []


    constructor: ->
      #! Initialize the schema.
      super()
      validateSchema = @validateSchema

      #! Load the Bookshelf registry plugin, which helps us avoid circular
      #! dependencies.
      @bookshelf.plugin "registry"

      #! Load the the app's pagination plugin, which gives us the `fetchPage`
      #! method on Models.
      @bookshelf.plugin require "./pagination"

      #! Prepare the parameters we will extend to our Bookshelf.Model
      self = this
      extendPrameters =
        tableName: @tableName
        hasTimestamps: true
        initialize: ->
          @on "creating", -> self.onCreate this
          @on "saving", -> self.onSave this
          @on "updating", -> self.onUpdate this
        validate: -> self.validateSchema @attributes or {}

      #! Extend with our custom parameters
      extendPrameters = _.extend extendPrameters, @extends

      #! Create the model and collection instances.
      @bookshelf.model @tableName, extendPrameters
      @model = @bookshelf.model @tableName
      @collection = @bookshelf.Collection.extend model: @model

      #! Now assign all the different enums into the object
      for e of @enums then do (e) =>
        value = @enums[e]

        #! Instantiate and read from the table first
        (new Enum value.tableName).then (json) =>
          #! If a pick option was set, then start picking the proper attribute
          #! and then save!
          if value.pick?
            picked = {}
            for item in json then picked[item[value.pick]] = item.id
            this[e] = picked

          #! Else, directly save the JSON
          else this[e] = json

      #! If caching was enabled then we load the entire table into the cache
      #! right away! (Calling this function does that)
      if @fullCache then @getAll()


    onCreate: (model) -> null
    onUpdate: (model) -> null
    onSave: (model) -> null


    ###
    **createSlug()** This is a helper function used to generate a unique slug from a price of
    given text. Useful for creating URL slugs.

    ```
    Model.createSlug('hello world') # -> 'hello-world-asdqw12asd'
    ```
    ###
    createSlug: (text="") ->
      slug "#{text} #{randomstring.generate 10}".toLowerCase()


    ###
    **findOne()** Queries all the rows and finds the first matching row that matches the
    values in the parameters.

    The function takes in two values; `parameters` which takes in an object
    with which you will query the DB. `options` which is used to modify the
    fetch query.

    This function returns a Promise which resolves iff a row has been found.

    TODO: Fix for sqlinjection

    ```
    Model.findOne(parameters).then (model) ->
    ```
    ###
    findOne: (parameters, options={}) ->
      options.require = true
      @model.forge(parameters).fetch options


    ###
    **get()** A simple function to fetch a single row given it's id.

    This function is a shorthand to the `findOne` function using only the id
    as the query parameter.

    ```
    Model.get(id).then (model) ->
    ```
    ###
    get: (id, options) -> @findOne id: id, options


    ###
    **getBySlug()** A simple function to fetch a single row given it's slug. Slugs are human
    readable and so are preferred than using the id.

    This function is a shorthand to the `findOne` function using only the slug
    as the query parameter.

    ```
    Model.getBySlug(slug).then (model) ->
    ```
    ###
    getBySlug: (slug, options) -> @findOne slug: slug, options



    ###
    **getAll()** This function is used to return all the entires in the DB. It is usually
    ideal to call this with small tables. For bigger tables see the `query()`
    function.

    ```
    Model.getAll(options).then (collection) ->
    ```
    ###
    getAll: (options={}) ->
      options.require = true

      #! If caching was enabled, then we operate this entire table from the
      #! cache.
      if @fullCache
        key = "model:#{@tableName}"

        Cache.get key

        #! If the data was not on the cache, then we reach here and query the
        #! DB to populate the cache.
        .catch (error) =>

          @model.forge().fetchAll(options).then (collections) =>
            #! Prepare a JSON string (for the cache and MD5)
            json = JSON.stringify collections

            #! If we were asked to keep an MD5 hash of the model (used for
            #! versioning client-side data in localStorage) then generate it and
            #! update the settings variable.
            if @enableMD5 then Settings.md5[key] = Md5 json

            #! Set the new data into the cache.
            Cache.set key, json

        #! From this point, we should have a JSON string containing our
        #! collection. So we call Bookshelf's collection to give it a proper
        #! structure and return.
        .then (collectionJSON) => @collection.forge JSON.parse collectionJSON

      #! If no caching was specified then we normally query the table.
      else @model.forge().fetchAll options


    ###
    **create()** Creates a new model from the given parameters and adds it
    into the DB.

    ```
    Model.create(parameters).then (model) ->
    ```
    ###
    #!! create: (parameters) -> @model.forge(@filter parameters).save()
    create: (parameters) -> @model.forge(parameters).save()


    ###
    **patch()** Updates an already existing model from DB with the id.

    ```
    Model.patch(id, parameters).then (model) ->
    ```
    ###
    patch: (id, parameters) -> @model.forge(id: id).save parameters


    ###
    **recent()** Finds the recent row sorting using the 'created_at' field.

    This function is simply a shorthand for the query function.

    ```
    Model.recent(buildQuery, options).then (result) ->
    ```
    ###
    recent: (buildQuery, options={}) ->
      options.order = created_at: "DESC"
      @query buildQuery, options


    ###
    **query()** This function is used to query the DB and return a pagintated
    version of the results. This is usefull for handling large-scale databases.

    This function returns a promise which resolves into two components.
    `collection` which contains the collections and `pagintation`
    which contain the information about the current page.

    ```
    buildQueryFn = (qb) ->
      qb.where "id", 1
      qb.where "status", 1

    Model.query(buildQuery, options)
    .then (results) ->
      result.collection = [...]
      result.pagintation: { .. }
    ```
    ###
    query: (buildQuery, options) -> @model.forge().fetchPage buildQuery, options


BaseModel["@require"] = [
  "igloo/knex"
  "models/base/enum"
  "libraries/cache"
  "igloo/settings"
]
BaseModel["@singleton"] = true
module.exports = BaseModel