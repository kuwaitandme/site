async = require "async"

exports = module.exports = (knex, cache) -> new class
  constructor: ->
    bookshelf = (require "bookshelf") knex
    @childModel       = bookshelf.Model.extend tableName: "child_categories"
    @parentModel      = bookshelf.Model.extend tableName: "parent_categories"
    @childCollection  = bookshelf.Collection.extend model: @childModel
    @parentCollection = bookshelf.Collection.extend model: @parentModel


  getAll: (callback) ->
    # Check in cache
    cache.get "model:categories", (error, results) =>
      if results then return callback null, JSON.parse results

      asyncTasks =
        parentCategory: (finish) =>
          @parentCollection.forge {}
          .query().then (categories) -> finish null, categories
        childCategory: (finish) =>
          @childCollection.forge {}
          .query().then (categories) -> finish null, categories

      asyncFinish = (error, results) ->
        categories = []

        # Start assigning child to their parent categories
        for category in results.parentCategory
          category.children = []
          for child in results.childCategory
            if category.id is child.parent_category
              category.children.push child
          categories.push category

        # Return the categories at last!
        cache.set "model:categories", JSON.stringify categories
        callback null, categories

      # Start the async tasks
      async.parallel asyncTasks, asyncFinish


      # # Categories was not cached, so query and then save in cache
      # @query {}, (error, categories) ->
      #   json = JSON.stringify categories, null, 2
      #   cache.set "model:categories", json
      #   callback error, categories


exports["@singleton"] = true
exports["@require"] = [
  "igloo/knex"
  "controllers/cache"
]


# exports = module.exports = (knex, cache) -> new class
#   constructor: ->
#     bookshelf = (require "bookshelf") knex
#     @model      = bookshelf.Model.extend tableName: "parent_categories"
#     @collection = bookshelf.Collection.extend model: @model


#   query: (parameters, callback) ->
#     @collection.forge parameters
#       .query().then (categories={}) -> callback null, categories


#   get: (id, callback) ->
#     @model.forge id: id
#       .fetch().then (category={}) -> callback null, category


#   getAll: (callback) ->
#     # Check in cache
#     cache.get "model:categories", (error, results) =>
#       if results then return callback null, JSON.parse results

#       # Categories was not cached, so query and then save in cache
#       @query {}, (error, categories) ->
#         json = JSON.stringify categories, null, 2
#         cache.set "model:categories", json
#         callback error, categories


# exports["@singleton"] = true
# exports["@require"] = [
#   "igloo/knex"
#   "controllers/cache"
# ]