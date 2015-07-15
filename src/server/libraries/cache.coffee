Promise        = require "bluebird"
cachemanMemory = Promise.promisifyAll require "cacheman-memory"

###*
 * This controller acts as an interface for the 'cachema-memory' module, adding
 * a few extra things and promisifying all the functions.
 *
 * NOTE: This cache must _ONLY_ _ONLY_ be used for resources that are finite in
 * size. ie. Do not use this cache for example storing classified pages
 * (because they are unique) but instead use it for content that are is fixed
 * like the category pages or the locations from the DB. Storing indefinite
 * items in this cache is a bad idea as you will run out memory if there are
 * too many items. (For such cases use redis instead).
 *
 * @author Steven Enamakel <me@steven.pw>
###
exports = module.exports = (IoC) ->
  cache = new cachemanMemory
  logger = IoC.create "igloo/logger"
  name = "[memory-cache]"

  new class Memory
    ###*
     * Stores or updates a value. Takes an optional TTL (time-to-live)
     *
     * @param String key        The keyname that gets stored in the cache
     * @param String value      The value of the given key
     * @param Number TTL        The time-to-live for the cache value after which
     *                          it expires from the cache.
     * @required key, value
     * @optional TTL
     *
     * @return Promise          A promise which resolves with the value that is
     *                          saved in the cache
     *
     * @example
     * instance.set("mykey1", '{"JSONSTRING": 1}')     // save key forever
     * instance.set("mykey2", '{"JSONSTRING": 1}', 60) // save key for 60s
    ###
    set: (key, value, TTL) ->
      new Promise (resolve, reject) ->
        # If a TTL was set, then called the TTL version of the cache
        if TTL? then cache.set key, value, TTL, (error, value) ->
          logger.debug name, "set: #{key} with TTL: #{TTL}s"
          if error then reject error else resolve value
        # If no TTL was set, then call the normal version
        else cache.set key, value, (error, value) ->
          logger.debug name, "set: #{key} with TTL: infinity"
          if error then reject error else resolve value


    ###*
     * Retrieves a value for a given key, if there is no value for the given key
     * the Promise fails
     *
     * @param String key       The key that is to be queried in the cache.
     * @required key
     *
     * @return Promise        A promise that resolves with the value from the
     *                         cache, but fails if there is some internal error
     *                         or if the key doesn't exist in cache
     *
     * @example
     * instance.get("mykey1")      // Resolves to '{"JSONSTRING": 1}'
     * instance.get("idontexist")  // Rejects to null
    ###
    get: (key) ->
      logger.debug name, "get: #{key}"
      new Promise (resolve, reject) -> cache.get key, (error, value) ->
        if error or not value then reject error else resolve value


    ###*
     * Deletes a key out of the cache.
     *
     * @param String key       The key that is to be queried in the cache.
     * @required key
     *
     * @return Promise         A promise that resolves with the value of the
     *                         deleted key
     *
     * @example
     * instance.del("mykey1")     // Resolves to '{"JSONSTRING": 1}'
     *
    ###
    del: (key) ->
      logger.debug name, "deleting: #{key}"
      new Promise (resolve, reject) -> cache.del key, (error, value) ->
        if error then reject error else resolve value


    ###*
     * Clear the cache entirely, throwing away all values.
     *
     * @return Promise        A promise that resolves if the cache was cleared
     *                        successfully.
     *
     * @example
     * instance.clear()
    ###
    clear: ->
      logger.debug name, "clearing"
      new Promise (resolve, reject) -> cache.clear (error, value) ->
        if error then reject error else resolve()


exports["@singleton"] = true
exports["@require"] = ["$container"]
