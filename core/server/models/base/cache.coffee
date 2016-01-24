_   = require "lodash"
MD5 = require "MD5"


Plugin = module.exports = (Cache) ->
  (bookshelf) ->
    oldFetch = bookshelf.Model.prototype.fetchAll

    _.extend bookshelf.Model.prototype,
      cache: false
      fetchAll: ->
        # If caching was enabled, then we operate this entire table from the
        # cache.
        if @cache
          key = "model:#{@tableName}"

          Cache.get key
          # If the data was not on the cache, then we reach here and query the
          # DB to populate the cache.
          .catch (error) =>
            oldFetch.call(this, arguments).then (collection) =>
              # Prepare a JSON string (for the cache and MD5)
              json = JSON.stringify collection

              # Keep an MD5 hash of the model (used for versioning client-side
              # data in localStorage) in the settings variable.
              Cache.set "md5:#{key}", MD5 json

              # Set the new data into the cache.
              Cache.set key, json

          # From this point, we should have a JSON string containing our
          # collection. So we call Bookshelf's collection to give it a proper
          # structure and return.
          .then (collectionJSON) => @all().set JSON.parse collectionJSON

        # If no caching was specified then we normally query the table.
        else oldFetch.call this, arguments