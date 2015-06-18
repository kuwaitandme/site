Promise        = require "bluebird"
cachemanMemory = Promise.promisifyAll require "cacheman-memory"

exports = module.exports = (IoC) ->
  cache = new cachemanMemory
  logger = IoC.create "igloo/logger"
  name = "[memory-cache]"

  new class Memory
    constructor: -> logger.debug name, "initializing"


    ###
      Stores or updates a value. Takes an optional TTL (time-to-live)
    ###
    set: (key, value, TTL=60 * 60 * 24) ->
      logger.debug name, "set: #{key} with TTL: #{TTL}s"
      new Promise (resolve, reject) ->
        cache.set key, value, TTL, (error, value) ->
          if error then reject error else resolve value


    ###
      Retrieves a value for a given key, if there is no value for the given key
      the Promise fails
    ###
    get: (key) ->
      logger.debug name, "get: #{key}"
      new Promise (resolve, reject) ->
        cache.get key, (error, value) ->
          if error or not value then reject error else resolve value


    ###
      Deletes a key out of the cache.
    ###
    del: (key) ->
      logger.debug name, "deleting: #{key}"
      new Promise (resolve, reject) ->
        cache.del key, (error, value) ->
          if error then reject error else resolve value


    ###
      Clear the cache entirely, throwing away all values.
    ###
    clear: ->
      logger.debug name, "clearing"
      new Promise (resolve, reject) ->
        cache.clear (error, value) -> if error then reject error else resolve()


exports["@singleton"] = true
exports["@require"] = ["$container"]
