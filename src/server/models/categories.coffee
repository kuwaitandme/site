Promise = require "bluebird"


exports = module.exports = (knex, Cache) ->
  bookshelf        = (require "bookshelf") knex

  childModel       = bookshelf.Model.extend tableName: "child_categories"
  parentModel      = bookshelf.Model.extend tableName: "parent_categories"
  childCollection  = bookshelf.Collection.extend model: childModel
  parentCollection = bookshelf.Collection.extend model: parentModel

  cacheKey = "model:categories"
  new class Model

    ###*
     * Returns all the categories in the DB. The returned JSON contains an array
     * of parent categories which in-turn contain an array of child categories.
     *
     *
     * @return Promise       A promise which resolves with the entire JSON of
     *                       the categories.
    ###
    getAll: ->
      # Check in cache first
      Cache.get cacheKey

      # If categories was not found in cache, then start querying the DB
      .catch ->
        Promise.props
          parentCategory: parentCollection.forge({}).query()
          childCategory: childCollection.forge({}).query()

        # Once the results have been fetched from the DB, we start parsing the
        # categories.
        .then (results) ->
          # Iterate and assign the child to their parent categories
          categories = []
          for pcat in results.parentCategory
            pcat.children = []
            for ccat in results.childCategory
              if pcat.id is ccat.parent_category then pcat.children.push ccat
            categories.push pcat

          # Once parsed, we set the JSON string into the cache.
          Cache.set cacheKey, JSON.stringify categories

      # Because the cache stores everything in strings, we parse our JSON string
      # into a proper object to avoid any inconsistencies from the receiving
      # end.
      .then (results) -> JSON.parse results


exports["@singleton"] = true
exports["@require"] = [
  "igloo/knex"
  "controllers/cache"
]
