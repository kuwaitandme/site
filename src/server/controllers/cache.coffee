Promise        = require "bluebird"
cachemanMemory = Promise.promisifyAll require "cacheman-memory"

exports = module.exports = (IoC) ->
  name = "[memcache]"
  logger = IoC.create "igloo/logger"
  cache = new cachemanMemory

  new class Memory
    constructor: -> logger.info name, "initializing in-memory cache"

    set: (key, value, TTL=60 * 60 * 24) ->
      logger.debug name, "set: #{key} with TTL: #{TTL}s"
      new Promise (resolve, reject) ->
        cache.set key, value, TTL, (error, value) ->
          if error then reject error else resolve value

    get: (key) ->
      logger.debug name, "get: #{key}"
      new Promise (resolve, reject) ->
        cache.get key, (error, value) ->
          if error or not value then reject error else resolve value


    del: (key) ->
      logger.debug name, "deleting: #{key}"
      new Promise (resolve, reject) ->
        cache.del key, (error, value) ->
          if error then reject error else resolve value

    clear: ->
      logger.debug name, "clearing"
      new Promise (resolve, reject) ->
        cache.clear (error, value) ->
          if error then reject error else resolve()


exports["@singleton"] = true
exports["@require"] = ["$container"]
