###*
 * Base Model
 *
 * This is the model from which all other Ghost models extend. The model is
 * based on Bookshelf.Model, and provides several basic behaviours such as
 * UUIDs, as well as a set of Data methods for accessing information from the
 * database.
 *
 * The models are internal to Ghost, only the API and some internal functions
 * such as migration and import/export accesses the models directly. All other
 * parts of Ghost, including the blog frontend, admin UI, and apps are only
 * allowed to access data via the API.
###
Bookshelf         = require "bookshelf"


exports = module.exports = (knex) ->
  class Model
    constructor: ->
      # Initialize bookshelf, the model and collection objects
      @bookshelf = Bookshelf knex
      @model = @bookshelf.Model.extend tableName: @tableName
      @collection = @bookshelf.Collection.extend model: @model

      # Load the Bookshelf registry plugin, which helps us avoid circular
      # dependencies.
      @bookshelf.plugin "registry"

      # # Load the common plugin, which gives us an interface to the common
      # # methods we'll use.
      # @bookshelf.plugin require "./base/common"

      # Load the Ghost pagination plugin, which gives us the `fetchPage` method
      # on Models.
      @bookshelf.plugin require "./base/pagination"

      # Load the validation plugin, which gives us the `clean` and `validate`
      # methods.
      @bookshelf.plugin require "./base/validation"


exports["@require"] = ["igloo/knex"]
exports["@singleton"] = true
